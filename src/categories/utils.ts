import { type SearchProductsQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export const getProductsFromSearchResults = (searchResults: SearchProductsQuery | undefined) => {
  if (!searchResults?.search) {
    return [];
  }

  return mapEdgesToItems(searchResults.search)?.filter(suggestedProduct => suggestedProduct.id);
};

export interface ProductCategory {
  category?: { id: string } | null;
}

export const isProductAssignedToCategory = (
  product: ProductCategory,
  categoryId: string | undefined,
): boolean => {
  if (!categoryId) {
    return false;
  }

  return product.category?.id === categoryId;
};
