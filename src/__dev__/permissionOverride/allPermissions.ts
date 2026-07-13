// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { PermissionEnum } from "@dashboard/graphql";

export const ALL_SALEOR_PERMISSIONS: PermissionEnum[] = Object.values(PermissionEnum).sort(
  (left, right) => left.localeCompare(right),
);

export const getPermissionLabel = (
  code: PermissionEnum,
  nameByCode: ReadonlyMap<PermissionEnum, string>,
): string => nameByCode.get(code) ?? code.replaceAll("_", " ").toLowerCase();
