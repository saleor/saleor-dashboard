import { User } from "@saleor/fragments/types/User";

import { PermissionEnum } from "../types/globalTypes";

export const hasPermission = (permission: PermissionEnum, user: User) =>
  user.userPermissions.map(perm => perm.code).includes(permission);

export const hasPermissions = (permissions: PermissionEnum[], user: User) =>
  permissions.some(permission => hasPermission(permission, user));
