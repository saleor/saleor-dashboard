import { PermissionGroupSortField } from "@saleor/graphql";
import { PermissionGroupListUrlSortField } from "@saleor/permissionGroups/urls";
import { createGetSortQueryVariables } from "@saleor/utils/sort";

export function getSortQueryField(
  sort: PermissionGroupListUrlSortField,
): PermissionGroupSortField {
  switch (sort) {
    case PermissionGroupListUrlSortField.name:
      return PermissionGroupSortField.NAME;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(
  getSortQueryField,
);
