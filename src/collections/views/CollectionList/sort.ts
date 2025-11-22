import { CollectionListUrlSortField } from "@dashboard/collections/urls";
import { CollectionSortField } from "@dashboard/graphql";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

export const DEFAULT_SORT_KEY = CollectionListUrlSortField.name;

export function canBeSorted(sort: CollectionListUrlSortField, isChannelSelected: boolean) {
  switch (sort) {
    case CollectionListUrlSortField.name:
    case CollectionListUrlSortField.productCount:
      return true;
    case CollectionListUrlSortField.availability:
      return isChannelSelected;
    default:
      return false;
  }
}

function getSortQueryField(sort: CollectionListUrlSortField): CollectionSortField | undefined {
  switch (sort) {
    case CollectionListUrlSortField.name:
      return "NAME";
    case CollectionListUrlSortField.availability:
      return "AVAILABILITY";
    case CollectionListUrlSortField.productCount:
      return "PRODUCT_COUNT";
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
