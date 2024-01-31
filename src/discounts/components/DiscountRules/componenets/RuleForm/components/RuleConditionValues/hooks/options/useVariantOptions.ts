import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { CommonSearchOpts } from "@dashboard/hooks/makeTopLevelSearch/types";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import useVariantSearch from "@dashboard/searches/useVariantSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export const useVariantOptions = (
  channel: string | null,
  conditionId: string | null,
) => {
  const {
    loadMore: loadMoreVariants,
    search: searchVariants,
    result: searchVariantsOpts,
  } = useVariantSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      channel,
    },
    skip: !channel || !conditionId || conditionId !== "variant",
  });

  const fetchMoreVariants = getSearchFetchMoreProps(
    searchVariantsOpts as CommonSearchOpts,
    loadMoreVariants,
  );

  return {
    fetch: searchVariants,
    fetchMoreProps: fetchMoreVariants,
    options: (mapEdgesToItems(searchVariantsOpts?.data?.search) ?? []).map(
      ({ name, id }) => ({
        label: name,
        value: id,
      }),
    ),
  };
};
