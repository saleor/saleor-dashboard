import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { CommonSearchOpts } from "@dashboard/hooks/makeTopLevelSearch/types";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import useProductSearchQuery from "@dashboard/searches/useProductSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export const useProductSearch = (channel: string) => {
  const {
    loadMore: loadMoreProducts,
    search: searchProducts,
    result: searchProductsOpts,
  } = useProductSearchQuery({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      channel,
    },
    skip: !channel,
  });

  const fetchMoreProducts = getSearchFetchMoreProps(
    searchProductsOpts as CommonSearchOpts,
    loadMoreProducts,
  );

  return {
    fetch: searchProducts,
    fetchMoreProps: fetchMoreProducts,
    options: (mapEdgesToItems(searchProductsOpts?.data?.search) ?? []).map(
      product => ({
        label: product.name,
        value: product.id,
      }),
    ),
  };
};
