import {
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

export const channelsDiff = (
  permissionGroup: PermissionGroupWithContextDetailsFragment,
  formData: PermissionGroupWithChannelsDetailsPageFormData,
) => {
  const newChannels = formData.channels;
  const oldChannels = permissionGroup?.accessibleChannels.map(c => c.id);
  const hasRestrictedChannels = permissionGroup?.restrictedAccessToChannels;

  return {
    addChannels: !hasRestrictedChannels
      ? newChannels
      : difference(newChannels, oldChannels),
    removeChannels: !hasRestrictedChannels
      ? []
      : difference(oldChannels, newChannels),
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

export const getPermissionGroupAccessibleChannels = (
  permissionGroup: PermissionGroupWithContextDetailsFragment,
  allChannelsLength: number,
) => {
  if (permissionGroup?.accessibleChannels?.length === allChannelsLength) {
    return [];
  }

  return permissionGroup?.accessibleChannels?.map(channel => channel.id) ?? [];
};
