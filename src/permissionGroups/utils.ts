import { UserContext } from "@dashboard/auth/types";
import { MultiAutocompleteChoiceType } from "@dashboard/components/MultiAutocompleteSelectField";
import {
  ChannelFragment,
  PermissionFragment,
  PermissionGroupDetailsFragment,
  UserFragment,
} from "@dashboard/graphql";
import { PermissionGroupWithContextDetailsFragment } from "@dashboard/graphql/types.channelPermissions.generated";
import difference from "lodash/difference";

import { PermissionGroupDetailsPageFormData } from "./components/PermissionGroupDetailsPage";
import { PermissionGroupWithChannelsDetailsPageFormData } from "./components/PermissonGroupWithChannelsDetailsPage";
/**
 * Will return true if group has all permissions available in shop assigned.
 */
export const isGroupFullAccess = (
  permissionGroup: PermissionGroupDetailsFragment,
  shopPermissions: Array<Omit<PermissionFragment, "__typename">>,
) => {
  const assignedCodes = extractPermissionCodes(permissionGroup);

  if (assignedCodes.length !== shopPermissions?.length) {
    return false;
  }

  for (const permission of shopPermissions) {
    if (assignedCodes.indexOf(permission.code) === undefined) {
      return false;
    }
  }
  return true;
};

/**
 * Return list of codes which are assigned to the permission group.
 */
export const extractPermissionCodes = (
  permissionGroup: PermissionGroupDetailsFragment,
) =>
  permissionGroup?.permissions
    ? permissionGroup.permissions.map(perm => perm.code)
    : [];

/**
 * Return lists of permissions which have to be added and removed from group.
 */
export const permissionsDiff = (
  permissionGroup: PermissionGroupDetailsFragment,
  formData: PermissionGroupDetailsPageFormData,
) => {
  const newPermissions = formData.permissions;
  const oldPermissions = extractPermissionCodes(permissionGroup);

  return {
    addPermissions: difference(newPermissions, oldPermissions),
    removePermissions: difference(oldPermissions, newPermissions),
  };
};

/**
 * Return lists of users which have to be added and removed from group.
 */
export const usersDiff = (
  permissionGroup: PermissionGroupDetailsFragment,
  formData: PermissionGroupDetailsPageFormData,
) => {
  const newUsers = formData.users.map(u => u.id);
  const oldUsers = permissionGroup?.users.map(u => u.id);

  return {
    addUsers: difference(newUsers, oldUsers),
    removeUsers: difference(oldUsers, newUsers),
  };
};

/**
 * Return lists of channels which have to be added and removed from group.
 */
export const channelsDiff = (
  permissionGroup: PermissionGroupWithContextDetailsFragment,
  formData: PermissionGroupWithChannelsDetailsPageFormData,
  allChannels: ChannelFragment[],
  isUserAbleToEdit: boolean,
) => {
  const newChannels = formData.hasAllChannels
    ? allChannels.map(c => c.id)
    : formData.channels;
  const oldChannels = permissionGroup?.accessibleChannels.map(c => c.id);
  const hasRestrictedChannels = permissionGroup?.restrictedAccessToChannels;

  if (!isUserAbleToEdit) {
    return {
      addChannels: [],
      removeChannels: [],
    };
  }

  if (!hasRestrictedChannels) {
    return {
      addChannels: newChannels,
      removeChannels: [],
    };
  }

  return {
    addChannels: difference(newChannels, oldChannels),
    removeChannels: difference(oldChannels, newChannels),
  };
};

/**
 * Permissions are exceeded when group has permission which is not handled by user
 */
export const arePermissionsExceeded = (
  permissionGroup: PermissionGroupDetailsFragment,
  user: UserFragment,
) => {
  const groupPermissions = extractPermissionCodes(permissionGroup);
  const userPermissions = user.userPermissions.map(p => p.code);
  return difference(groupPermissions, userPermissions).length > 0;
};

/**
 * Return lists of permission group accessible channels.
 */
export const mapAccessibleChannelsToChoice = (
  permissionGroup: PermissionGroupWithContextDetailsFragment,
  isUserAbleToEdit?: boolean,
): MultiAutocompleteChoiceType[] =>
  permissionGroup?.accessibleChannels.map(
    channel =>
      ({
        label: channel.name,
        value: channel.id,
        disabled: isUserAbleToEdit !== undefined ? !isUserAbleToEdit : false,
      } as unknown as MultiAutocompleteChoiceType),
  ) ?? [];

/**
 * User is eligible to edit channels when he has access to all channels in permission group.
 */
export const checkIfUserIsEligibleToEditChannels = (
  user: UserContext["user"],
  permissionGroupAccessibleChannels: ChannelFragment[],
) => {
  const userChannels = getUserAccessibleChannels(user).map(c => c.id);

  return permissionGroupAccessibleChannels.every(permChan =>
    userChannels.includes(permChan.id),
  );
};

/**
 * Get channels options for select field.
 */
export const getChannelsOptions = (
  availableChannels: ChannelFragment[],
  user?: UserContext["user"],
): ChannelFragment[] => {
  if (!user) {
    return availableChannels;
  }

  if (
    "restrictedAccessToChannels" in user &&
    user.restrictedAccessToChannels === false
  ) {
    return availableChannels;
  }

  if ("accessibleChannels" in user) {
    return user.accessibleChannels;
  }

  return availableChannels;
};

/**
 * Check if user has restricted access to channels.
 */
export const checkIfUserHasRestictedChannels = (user?: UserContext["user"]) => {
  if (user && "restrictedAccessToChannels" in user) {
    return user.restrictedAccessToChannels;
  }

  return false;
};

/**
 * Get user accessible channels.
 */
const getUserAccessibleChannels = (user?: UserContext["user"]) => {
  if (user && "accessibleChannels" in user) {
    return user.accessibleChannels;
  }

  return [];
};

export const getInitialChannels = (
  permissionGroup: PermissionGroupWithContextDetailsFragment,
  isUserAbleToEdit: boolean,
  allChannelsLength: number,
) => {
  if (!isUserAbleToEdit) {
    return [];
  }

  if (
    !permissionGroup?.restrictedAccessToChannels &&
    permissionGroup?.accessibleChannels.length === allChannelsLength
  ) {
    return [];
  }

  return permissionGroup?.accessibleChannels.map(channel => channel.id);
};
