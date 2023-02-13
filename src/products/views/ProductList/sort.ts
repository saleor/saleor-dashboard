import { ProductOrder, ProductOrderField } from "@dashboard/graphql";
import {
  ProductListUrlQueryParams,
  ProductListUrlSortField,
} from "@dashboard/products/urls";
import { getOrderDirection } from "@dashboard/utils/sort";

export const DEFAULT_SORT_KEY = ProductListUrlSortField.name;

export function canBeSorted(
  sort: ProductListUrlSortField,
  isChannelSelected: boolean,
) {
  switch (sort) {
    case ProductListUrlSortField.name:
    case ProductListUrlSortField.productType:
    case ProductListUrlSortField.date:
      return true;
    case ProductListUrlSortField.price:
      return isChannelSelected;
    default:
      return false;
  }
}

export function getSortQueryField(
  sort: ProductListUrlSortField,
): ProductOrderField {
  switch (sort) {
    case ProductListUrlSortField.name:
      return ProductOrderField.NAME;
    case ProductListUrlSortField.price:
      return ProductOrderField.PRICE;
    case ProductListUrlSortField.productType:
      return ProductOrderField.TYPE;
    // case ProductListUrlSortField.status:
    // return ProductOrderField.PUBLISHED;
    // case ProductListUrlSortField.rank:
    // return ProductOrderField.RANK;
    case ProductListUrlSortField.date:
      return ProductOrderField.DATE;
    default:
      return undefined;
  }
}

export function getSortQueryVariables(
  params: ProductListUrlQueryParams,
  isChannelSelected: boolean,
): ProductOrder {
  if (!canBeSorted(params.sort, isChannelSelected)) {
    return;
  }

  const direction = getOrderDirection(params.asc);

  const field = getSortQueryField(params.sort);
  return {
    direction,
    field,
  };
}
