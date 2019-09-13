import { getOrderDirection } from "@saleor/misc";
import {
  ProductListUrlQueryParams,
  ProductListUrlSortField
} from "@saleor/products/urls";
import { Sort } from "@saleor/types";
import { ProductOrder, ProductOrderField } from "@saleor/types/globalTypes";

export function getSortQueryField(
  sort: ProductListUrlSortField
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
    default:
      return ProductOrderField.NAME;
  }
}

export function getSortQueryVariables(
  params: ProductListUrlQueryParams
): ProductOrder {
  return {
    direction: getOrderDirection(params.asc),
    field: getSortQueryField(params.sort)
  };
}

export function getSortUrlField(
  sort: ProductOrderField
): ProductListUrlSortField {
  switch (sort) {
    case ProductOrderField.NAME:
      return ProductListUrlSortField.name;
    case ProductOrderField.PRICE:
      return ProductListUrlSortField.price;
    case ProductOrderField.TYPE:
      return ProductListUrlSortField.productType;
    case ProductOrderField.PUBLISHED:
      return ProductListUrlSortField.status;
    default:
      return ProductListUrlSortField.name;
  }
}

export function getSortUrlVariables(
  field: ProductListUrlSortField,
  params: Sort<ProductListUrlSortField>
): Sort<ProductListUrlSortField> {
  if (field === params.sort) {
    return {
      asc: !params.asc,
      sort: field
    };
  }

  return {
    asc: true,
    sort: field
  };
}
