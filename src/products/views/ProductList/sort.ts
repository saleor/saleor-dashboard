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

function getSortQueryField(sort: ProductListUrlSortField): ProductOrderField | undefined {
  switch (sort) {
    case ProductListUrlSortField.name:
      return ProductOrderField.NAME;
    case ProductListUrlSortField.price:
      return ProductOrderField.PRICE;
    case ProductListUrlSortField.productType:
      return ProductOrderField.TYPE;
    case ProductListUrlSortField.availability:
      return ProductOrderField.PUBLISHED;
    case ProductListUrlSortField.rank:
      return ProductOrderField.RANK;
    case ProductListUrlSortField.date:
      return ProductOrderField.DATE;
    case ProductListUrlSortField.created:
      return ProductOrderField.CREATED_AT;
    default:
      return undefined;
  }
}

export function getSortQueryVariables(
  params: ProductListUrlQueryParams,
  isChannelSelected: boolean,
): ProductOrder | undefined {
  if (!params.sort || !canBeSorted(params.sort, isChannelSelected)) {
    return undefined;
  }

  const direction = getOrderDirection(params.asc ?? false);

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
