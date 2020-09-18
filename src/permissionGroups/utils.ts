import { ShopInfo_shop_permissions } from "@saleor/components/Shop/types/ShopInfo";
import { User } from "@saleor/fragments/types/User";
import difference from "lodash-es/difference";

import { PermissionGroupDetailsPageFormData } from "./components/PermissionGroupDetailsPage";
import { PermissionGroupDetails_permissionGroup } from "./types/PermissionGroupDetails";

/**
 * Will return true if group has all permissions available in shop assigned.
 */
export const isGroupFullAccess = (
  permissionGroup: PermissionGroupDetails_permissionGroup,
  shopPermissions: ShopInfo_shop_permissions[]
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
  permissionGroup: PermissionGroupDetails_permissionGroup
) =>
  permissionGroup?.permissions
    ? permissionGroup.permissions.map(perm => perm.code)
    : [];

/**
 * Return lists of permissions which have to be added and removed from group.
 */
export const permissionsDiff = (
  permissionGroup: PermissionGroupDetails_permissionGroup,
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
  permissionGroup: PermissionGroupDetails_permissionGroup,
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
  permissionGroup: PermissionGroupDetails_permissionGroup,
  user: User
) => {
  const groupPermissions = extractPermissionCodes(permissionGroup);
  const userPermissions = user.userPermissions.map(p => p.code);
  return difference(groupPermissions, userPermissions).length > 0;
};
