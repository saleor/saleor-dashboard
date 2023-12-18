import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { CommonSearchOpts } from "@dashboard/hooks/makeTopLevelSearch/types";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import useCollectionSearch from "@dashboard/searches/useCollectionSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export const useCollectionOptions = (channel: string) => {
  const {
    loadMore: loadMoreCollections,
    search: searchCollections,
    result: searchCollectionsOpts,
  } = useCollectionSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      channel,
    },
    skip: !channel,
  });

  const fetchMoreCollections = getSearchFetchMoreProps(
    searchCollectionsOpts as CommonSearchOpts,
    loadMoreCollections,
  );

  return {
    fetch: searchCollections,
    fetchMoreProps: fetchMoreCollections,
    options: (mapEdgesToItems(searchCollectionsOpts?.data?.search) ?? []).map(
      collection => ({
        label: collection.name,
        value: collection.id,
      }),
    ),
  };
};
