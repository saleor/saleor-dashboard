import { CategoryListUrlSortField } from "@saleor/categories/urls";
import { CategorySortField } from "@saleor/graphql";
import { createGetSortQueryVariables } from "@saleor/utils/sort";

export function getSortQueryField(
  sort: CategoryListUrlSortField,
): CategorySortField {
  switch (sort) {
    case CategoryListUrlSortField.name:
      return CategorySortField.NAME;
    case CategoryListUrlSortField.productCount:
      return CategorySortField.PRODUCT_COUNT;
    case CategoryListUrlSortField.subcategoryCount:
      return CategorySortField.SUBCATEGORY_COUNT;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(
  getSortQueryField,
);
