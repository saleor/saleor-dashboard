// @ts-strict-ignore
import { ProductOrder, ProductOrderField } from "@dashboard/graphql";
import { ProductListUrlQueryParams, ProductListUrlSortField } from "@dashboard/products/urls";
import { getOrderDirection } from "@dashboard/utils/sort";

export const DEFAULT_SORT_KEY = ProductListUrlSortField.name;

export function canBeSorted(sort: ProductListUrlSortField, isChannelSelected: boolean) {
  switch (sort) {
    case ProductListUrlSortField.name:
    case ProductListUrlSortField.productType:
    case ProductListUrlSortField.date:
    case ProductListUrlSortField.created:
    case ProductListUrlSortField.attribute:
    case ProductListUrlSortField.rank:
      return true;
    case ProductListUrlSortField.price:
    case ProductListUrlSortField.availability:
      return isChannelSelected;
    default:
      return false;
  }
}

function getSortQueryField(sort: ProductListUrlSortField): ProductOrderField {
  switch (sort) {
    case ProductListUrlSortField.name:
      return "NAME";
    case ProductListUrlSortField.price:
      return "PRICE";
    case ProductListUrlSortField.productType:
      return "TYPE";
    case ProductListUrlSortField.availability:
      return "PUBLISHED";
    case ProductListUrlSortField.rank:
      return "RANK";
    case ProductListUrlSortField.date:
      return "DATE";
    case ProductListUrlSortField.created:
      return "CREATED_AT";
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
