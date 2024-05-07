import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { CommonSearchOpts } from "@dashboard/hooks/makeTopLevelSearch/types";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import useProductSearch from "@dashboard/searches/useProductSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export const useProductOptions = (channel: string | null, conditionId: string | null) => {
  const {
    loadMore: loadMoreProducts,
    search: searchProducts,
    result: searchProductsOpts,
  } = useProductSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      channel,
    },
    skip: !channel || !conditionId || conditionId !== "product",
  });
  const fetchMoreProducts = getSearchFetchMoreProps(
    searchProductsOpts as CommonSearchOpts,
    loadMoreProducts,
  );

  return {
    fetch: searchProducts,
    fetchMoreProps: fetchMoreProducts,
    options: (mapEdgesToItems(searchProductsOpts?.data?.search) ?? []).map(({ name, id }) => ({
      label: name,
      value: id,
    })),
  };
};
