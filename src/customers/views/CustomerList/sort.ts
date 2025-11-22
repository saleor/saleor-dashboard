import { CustomerListUrlSortField } from "@dashboard/customers/urls";
import { UserSortField } from "@dashboard/graphql";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

function getSortQueryField(sort: CustomerListUrlSortField): UserSortField | undefined {
  switch (sort) {
    case CustomerListUrlSortField.email:
      return "EMAIL";
    case CustomerListUrlSortField.name:
      return "LAST_NAME";
    case CustomerListUrlSortField.orders:
      return "ORDER_COUNT";
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
