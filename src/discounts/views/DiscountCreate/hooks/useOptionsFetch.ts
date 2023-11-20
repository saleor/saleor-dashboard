import { QueryResult } from "@apollo/client";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import useCategorySearch from "@dashboard/searches/useCategorySearch";
import useCollectionSearch from "@dashboard/searches/useCollectionSearch";
import useProductSearch from "@dashboard/searches/useProductSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Option } from "@saleor/macaw-ui-next";

export type OptionsType = "products" | "categories" | "collections";
export interface FetchOptions {
  fetch: (query: string) => void;
  loadMore: () => void;
  loading: boolean;
  result: QueryResult<any>;
  options: Option[];
}

export const useOptionsFetch = () => {
  const {
    loadMore: loadMoreCategories,
    search: searchCategories,
    result: searchCategoriesOpts,
  } = useCategorySearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const {
    loadMore: loadMoreCollections,
    search: searchCollections,
    result: searchCollectionsOpts,
  } = useCollectionSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const {
    loadMore: loadMoreProducts,
    search: searchProducts,
    result: searchProductsOpts,
  } = useProductSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });

  return (type: OptionsType): FetchOptions => {
    if (type === "products") {
      return {
        fetch: searchProducts,
        loadMore: loadMoreProducts,
        loading: searchProductsOpts.loading,
        result: searchProductsOpts,
        options: (mapEdgesToItems(searchProductsOpts?.data?.search) ?? []).map(
          product => ({
            label: product.name,
            value: product.id,
          }),
        ),
      };
    }

    if (type === "categories") {
      return {
        fetch: searchCategories,
        loadMore: loadMoreCategories,
        loading: searchCategoriesOpts.loading,
        result: searchCategoriesOpts,
        options: (
          mapEdgesToItems(searchCategoriesOpts?.data?.search) ?? []
        ).map(category => ({
          label: category.name,
          value: category.id,
        })),
      };
    }

    if (type === "collections") {
      return {
        fetch: searchCollections,
        loadMore: loadMoreCollections,
        loading: searchCollectionsOpts.loading,
        result: searchCollectionsOpts,
        options: (
          mapEdgesToItems(searchCollectionsOpts?.data?.search) ?? []
        ).map(collection => ({
          label: collection.name,
          value: collection.id,
        })),
      };
    }
  };
};
