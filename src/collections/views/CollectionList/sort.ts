import { CollectionListUrlSortField } from "@saleor/collections/urls";
import { CollectionSortField } from "@saleor/graphql";
import { createGetSortQueryVariables } from "@saleor/utils/sort";

export const DEFAULT_SORT_KEY = CollectionListUrlSortField.name;

export function canBeSorted(
  sort: CollectionListUrlSortField,
  isChannelSelected: boolean,
) {
  switch (sort) {
    case CollectionListUrlSortField.name:
    case CollectionListUrlSortField.productCount:
      return true;
    case CollectionListUrlSortField.available:
      return isChannelSelected;
    default:
      return false;
  }
}

export function getSortQueryField(
  sort: CollectionListUrlSortField,
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
  getSortQueryField,
);
