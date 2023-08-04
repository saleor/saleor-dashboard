import { PermissionGroupSortField } from "@dashboard/graphql";
import { PermissionGroupListUrlSortField } from "@dashboard/permissionGroups/urls";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

export function getSortQueryField(
  sort: PermissionGroupListUrlSortField,
): PermissionGroupSortField {
  switch (sort) {
    case PermissionGroupListUrlSortField.name:
      return PermissionGroupSortField.NAME;
    default:
      return "" as PermissionGroupSortField;
  }
}

export const getSortQueryVariables =
  createGetSortQueryVariables(getSortQueryField);
