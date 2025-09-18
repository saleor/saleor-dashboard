import { PermissionEnum } from "@dashboard/graphql";

export const hasPermissionSelected = (permissions: string[], permissionCode: PermissionEnum) =>
  permissions.filter(userPerm => userPerm === permissionCode).length === 1;
