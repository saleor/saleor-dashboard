import { UserSortField } from "@dashboard/graphql";
import { StaffListUrlSortField } from "@dashboard/staff/urls";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

export function getSortQueryField(sort: StaffListUrlSortField): UserSortField | undefined {
  switch (sort) {
    case StaffListUrlSortField.name:
      return UserSortField.LAST_NAME;
    case StaffListUrlSortField.email:
      return UserSortField.EMAIL;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
