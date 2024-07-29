import { UserContext } from "@dashboard/auth/types";
import {
  ChannelFragment,
  PermissionFragment,
  PermissionGroupDetailsFragment,
  UserFragment,
} from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";
import difference from "lodash/difference";

import { PermissionGroupDetailsPageFormData } from "./components/PermissionGroupDetailsPage";

/**
 * Will return true if group has all permissions available in shop assigned.
 */
export const isGroupFullAccess = (
  permissionGroup: PermissionGroupDetailsFragment | null | undefined,
  shopPermissions: Array<Omit<PermissionFragment, "__typename">>,
) => {
  if (!permissionGroup) {
    return false;
  }

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
  permissionGroup: PermissionGroupDetailsFragment | null | undefined,
) => {
  if (!permissionGroup) {
    return [];
  }

  return permissionGroup?.permissions ? permissionGroup.permissions.map(perm => perm.code) : [];
};

/**
 * Return lists of permissions which have to be added and removed from group.
 */
export const permissionsDiff = (
  permissionGroup: PermissionGroupDetailsFragment | null | undefined,
  formData: PermissionGroupDetailsPageFormData,
) => {
  if (!permissionGroup) {
    return {
      addPermissions: [],
      removePermissions: [],
    };
  }

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
  permissionGroup: PermissionGroupDetailsFragment | null | undefined,
  formData: PermissionGroupDetailsPageFormData,
) => {
  if (!permissionGroup) {
    return {
      addUsers: [],
      removeUsers: [],
    };
  }

  const newUsers = formData?.users?.map(u => u.id) ?? [];
  const oldUsers = permissionGroup?.users?.map(u => u.id) ?? [];

  return {
    addUsers: difference(newUsers, oldUsers),
    removeUsers: difference(oldUsers, newUsers),
  };
};

/**
 * Return lists of channels which have to be added and removed from group.
 */
export const channelsDiff = (
  permissionGroup: PermissionGroupDetailsFragment | null | undefined,
  formData: PermissionGroupDetailsPageFormData,
  allChannels: ChannelFragment[],
  isGroupEditable: boolean,
) => {
  if (!permissionGroup || !isGroupEditable) {
    return {
      addChannels: [],
      removeChannels: [],
    };
  }

  const newChannels = formData.hasAllChannels ? allChannels.map(c => c.id) : formData.channels;
  const oldChannels = permissionGroup?.accessibleChannels?.map(c => c.id) ?? [];
  const hasRestrictedChannels = permissionGroup?.restrictedAccessToChannels ?? false;

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
  permissionGroup: PermissionGroupDetailsFragment | null | undefined,
  user: UserFragment | null | undefined,
) => {
  if (!permissionGroup || !user) {
    return false;
  }

  const groupPermissions = extractPermissionCodes(permissionGroup);
  const userPermissions = user?.userPermissions?.map(p => p.code) ?? [];

  return difference(groupPermissions, userPermissions).length > 0;
};

/**
 * Return lists of permission group accessible channels.
 */
export const mapAccessibleChannelsToChoice = (
  permissionGroup: PermissionGroupDetailsFragment,
  isUserAbleToEdit?: boolean,
): Option[] =>
  permissionGroup?.accessibleChannels?.map(
    channel =>
      ({
        label: channel.name,
        value: channel.id,
        disabled: isUserAbleToEdit !== undefined ? !isUserAbleToEdit : false,
      }) as unknown as Option,
  ) ?? [];

export const checkIfUserBelongToPermissionGroup = (
  permissionGroup: PermissionGroupDetailsFragment | null | undefined,
  userId: string,
) => {
  return permissionGroup?.users?.some(u => u.id === userId) ?? false;
};

/**
 * Get channels options for select field.
 */
export const getUserAccessibleChannelsOptions = (
  availableChannels: ChannelFragment[],
  user?: UserContext["user"],
): ChannelFragment[] => {
  if (!user) {
    return [];
  }

  if (!user.restrictedAccessToChannels) {
    return availableChannels;
  }

  if (user.accessibleChannels !== null) {
    return user.accessibleChannels;
  }

  return [];
};

/**
 * Check if user has restricted access to channels.
 */
export const checkIfUserHasRestictedAccessToChannels = (user?: UserContext["user"]) => {
  if (user) {
    return user.restrictedAccessToChannels;
  }

  return false;
};

export const getInitialChannels = (
  permissionGroup: PermissionGroupDetailsFragment | null | undefined,
  allChannelsLength: number,
) => {
  if (!permissionGroup) {
    return [];
  }

  if (
    !permissionGroup?.restrictedAccessToChannels &&
    permissionGroup?.accessibleChannels?.length === allChannelsLength
  ) {
    return [];
  }

  return permissionGroup?.accessibleChannels?.map(channel => channel.id) ?? [];
};
