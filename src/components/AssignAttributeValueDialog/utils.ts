import {
  AttributeInputTypeEnum,
  SearchCategoriesQuery,
  SearchCollectionsQuery,
  SearchPagesQuery,
  SearchProductsQuery,
} from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

import { AttributeInput } from "../Attributes";

type ProductsToFilter = RelayToFlat<SearchProductsQuery["search"]>;
type PagesToFilter = RelayToFlat<SearchPagesQuery["search"]>;
type CollectionsToFilter = RelayToFlat<SearchCollectionsQuery["search"]>;
type CategoriesToFilter = RelayToFlat<SearchCategoriesQuery["search"]>;

export const filterProductsByAttributeValues = (
  products: ProductsToFilter,
  attribute: AttributeInput,
): ProductsToFilter => {
  const isSingle = attribute.data.inputType === AttributeInputTypeEnum.SINGLE_REFERENCE;

  // For single reference, don't filter - show all items to view current selection
  if (isSingle) {
    return products;
  }

  switch (attribute.data.entityType) {
    case "PRODUCT":
      return products?.filter(product => !attribute.value.includes(product.id)) ?? [];
    case "PRODUCT_VARIANT":
      return (
        products?.map(product => ({
          ...product,
          variants:
            product.variants?.filter(variant => !attribute.value.includes(variant.id)) ?? [],
        })) ?? []
      );
    default:
      return products;
  }
};

export const filterPagesByAttributeValues = (
  pages: PagesToFilter,
  attribute: AttributeInput,
): PagesToFilter => {
  const isSingle = attribute.data.inputType === AttributeInputTypeEnum.SINGLE_REFERENCE;

  // For single reference, don't filter - show all items to view current selection
  if (isSingle) {
    return pages;
  }

  return pages?.filter(page => !attribute.value.includes(page.id)) ?? [];
};

export const filterCollectionsByAttributeValues = (
  collections: CollectionsToFilter,
  attribute: AttributeInput,
): CollectionsToFilter => {
  const isSingle = attribute.data.inputType === AttributeInputTypeEnum.SINGLE_REFERENCE;

  // For single reference, don't filter - show all items to view current selection
  if (isSingle) {
    return collections;
  }

  return collections?.filter(collection => !attribute.value.includes(collection.id)) ?? [];
};

export const filterCategoriesByAttributeValues = (
  categories: CategoriesToFilter,
  attribute: AttributeInput,
): CategoriesToFilter => {
  const isSingle = attribute.data.inputType === AttributeInputTypeEnum.SINGLE_REFERENCE;

  // For single reference, don't filter - show all items to view current selection
  if (isSingle) {
    return categories;
  }

  return categories?.filter(category => !attribute.value.includes(category.id)) ?? [];
};
