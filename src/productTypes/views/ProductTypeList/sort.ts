// @ts-strict-ignore
import { ProductTypeSortField } from "@dashboard/graphql";
import { ProductTypeListUrlSortField } from "@dashboard/productTypes/urls";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

function getSortQueryField(sort: ProductTypeListUrlSortField): ProductTypeSortField {
  switch (sort) {
    case ProductTypeListUrlSortField.name:
      return ProductTypeSortField.NAME;
    case ProductTypeListUrlSortField.digital:
      return ProductTypeSortField.DIGITAL;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
