import { UserSortField } from "@dashboard/graphql";
import { StaffListUrlSortField } from "@dashboard/staff/urls";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

function getSortQueryField(sort: StaffListUrlSortField): UserSortField | undefined {
  switch (sort) {
    case StaffListUrlSortField.name:
      return "LAST_NAME";
    case StaffListUrlSortField.email:
      return "EMAIL";
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
