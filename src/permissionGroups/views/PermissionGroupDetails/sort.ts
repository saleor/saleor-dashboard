import { MembersListUrlSortField } from "@saleor/permissionGroups/urls";
import { MembersSortField } from "@saleor/types/globalTypes";
import { createGetSortQueryVariables } from "@saleor/utils/sort";

export function getSortQueryField(
  sort: MembersListUrlSortField
): MembersSortField {
  switch (sort) {
    case MembersListUrlSortField.name:
      return MembersSortField.NAME;
    case MembersListUrlSortField.email:
      return MembersSortField.EMAIL;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(
  getSortQueryField
);
