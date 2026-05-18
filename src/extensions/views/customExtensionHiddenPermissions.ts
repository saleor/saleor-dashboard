import { PermissionEnum } from "@dashboard/graphql";

export const HIDDEN_CUSTOM_EXTENSION_PERMISSIONS: readonly PermissionEnum[] = [
  PermissionEnum.MANAGE_APPS,
];

export const filterCustomExtensionPermissions = <T extends { code: PermissionEnum }>(
  permissions: T[],
): T[] => permissions.filter(p => !HIDDEN_CUSTOM_EXTENSION_PERMISSIONS.includes(p.code));
