import { PermissionEnum, UserFragment } from "@saleor/graphql";

export const hasPermission = (permission: PermissionEnum, user: UserFragment) =>
  user.userPermissions.map(perm => perm.code).includes(permission);

export const hasAnyPermissions = (
  permissions: PermissionEnum[],
  user: UserFragment,
) => permissions?.some(permission => hasPermission(permission, user)) || false;

export const hasAllPermissions = (
  permissions: PermissionEnum[],
  user: UserFragment,
) => permissions?.every(permission => hasPermission(permission, user)) || false;
