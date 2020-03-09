import { ShopInfo_shop_permissions } from "@saleor/components/Shop/types/ShopInfo";
import { PermissionGroupDetails_permissionGroup } from "./types/PermissionGroupDetails";

/**
 * Will return true if group has all permissions available in shop assigned.
 */
export const isGroupFullAccess = (
  permissionGroup: PermissionGroupDetails_permissionGroup,
  shopPermissions: ShopInfo_shop_permissions[]
) => {
  const assignedCodes = permissionGroup?.permissions
    ? permissionGroup.permissions.map(perm => perm.code)
    : [];

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
