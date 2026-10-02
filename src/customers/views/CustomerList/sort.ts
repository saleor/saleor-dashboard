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

const sortableColumns: CustomerListUrlSortField[] = Object.values(CustomerListUrlSortField).filter(
  field => getSortQueryField(field) !== undefined,
);

/** Only columns backed by a `UserSortField` can be sorted, the API has no other ordering. */
export const canBeSorted = (columnId: string): columnId is CustomerListUrlSortField =>
  sortableColumns.some(field => field === columnId);
