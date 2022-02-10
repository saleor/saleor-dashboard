import {
  PermissionFragmentFragment,
  PermissionGroupDetailsFragmentFragment,
  UserFragment
} from "@saleor/graphql";
import difference from "lodash/difference";

import { PermissionGroupDetailsPageFormData } from "./components/PermissionGroupDetailsPage";

/**
 * Will return true if group has all permissions available in shop assigned.
 */
export const isGroupFullAccess = (
  permissionGroup: PermissionGroupDetailsFragmentFragment,
  shopPermissions: PermissionFragmentFragment[]
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
  permissionGroup: PermissionGroupDetailsFragmentFragment
) =>
  permissionGroup?.permissions
    ? permissionGroup.permissions.map(perm => perm.code)
    : [];

/**
 * Return lists of permissions which have to be added and removed from group.
 */
export const permissionsDiff = (
  permissionGroup: PermissionGroupDetailsFragmentFragment,
  formData: PermissionGroupDetailsPageFormData
) => {
  const newPermissions = formData.permissions;
  const oldPermissions = extractPermissionCodes(permissionGroup);

  return {
    addPermissions: difference(newPermissions, oldPermissions),
    removePermissions: difference(oldPermissions, newPermissions)
  };
};

/**
 * Return lists of users which have to be added and removed from group.
 */
export const usersDiff = (
  permissionGroup: PermissionGroupDetailsFragmentFragment,
  formData: PermissionGroupDetailsPageFormData
) => {
  const newUsers = formData.users.map(u => u.id);
  const oldUsers = permissionGroup?.users.map(u => u.id);

  return {
    addUsers: difference(newUsers, oldUsers),
    removeUsers: difference(oldUsers, newUsers)
  };
};

/**
 * Permissions are exceeded when group has permission which is not handled by user
 */
export const arePermissionsExceeded = (
  permissionGroup: PermissionGroupDetailsFragmentFragment,
  user: UserFragment
) => {
  const groupPermissions = extractPermissionCodes(permissionGroup);
  const userPermissions = user.userPermissions.map(p => p.code);
  return difference(groupPermissions, userPermissions).length > 0;
};
