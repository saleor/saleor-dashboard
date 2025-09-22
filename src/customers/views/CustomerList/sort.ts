import { CustomerListUrlSortField } from "@dashboard/customers/urls";
import { UserSortField } from "@dashboard/graphql";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

function getSortQueryField(sort: CustomerListUrlSortField): UserSortField | undefined {
  switch (sort) {
    case CustomerListUrlSortField.email:
      return UserSortField.EMAIL;
    case CustomerListUrlSortField.name:
      return UserSortField.LAST_NAME;
    case CustomerListUrlSortField.orders:
      return UserSortField.ORDER_COUNT;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
