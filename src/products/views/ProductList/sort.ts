import { ProductOrder, ProductOrderField } from "@saleor/graphql";
import {
  ProductListUrlQueryParams,
  ProductListUrlSortField,
} from "@saleor/products/urls";
import { getOrderDirection } from "@saleor/utils/sort";

export const DEFAULT_SORT_KEY = ProductListUrlSortField.name;

export function canBeSorted(
  sort: ProductListUrlSortField,
  isChannelSelected: boolean,
) {
  switch (sort) {
    case ProductListUrlSortField.name:
    case ProductListUrlSortField.productType:
    case ProductListUrlSortField.attribute:
    case ProductListUrlSortField.rank:
    case ProductListUrlSortField.date:
      return true;
    case ProductListUrlSortField.price:
    case ProductListUrlSortField.status:
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
    case ProductListUrlSortField.status:
      return ProductOrderField.PUBLISHED;
    case ProductListUrlSortField.rank:
      return ProductOrderField.RANK;
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
  if (params.sort === ProductListUrlSortField.attribute) {
    return {
      attributeId: params.attributeId,
      direction,
    };
  }

  const field = getSortQueryField(params.sort);
  return {
    direction,
    field,
  };
}
