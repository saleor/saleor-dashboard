import { CategoryListUrlSortField } from "@dashboard/categories/urls";
import { CategorySortField } from "@dashboard/graphql";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

function getSortQueryField(sort: CategoryListUrlSortField): CategorySortField | undefined {
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

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
