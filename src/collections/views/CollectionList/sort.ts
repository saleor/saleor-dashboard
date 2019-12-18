import { CollectionListUrlSortField } from "@saleor/collections/urls";
import { CollectionSortField } from "@saleor/types/globalTypes";
import { createGetSortQueryVariables } from "@saleor/utils/sort";

export function getSortQueryField(
  sort: CollectionListUrlSortField
): CollectionSortField {
  switch (sort) {
    case CollectionListUrlSortField.name:
      return CollectionSortField.NAME;
    case CollectionListUrlSortField.available:
      return CollectionSortField.AVAILABILITY;
    case CollectionListUrlSortField.productCount:
      return CollectionSortField.PRODUCT_COUNT;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(
  getSortQueryField
);
