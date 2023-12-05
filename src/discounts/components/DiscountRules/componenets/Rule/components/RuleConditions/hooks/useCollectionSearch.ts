import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import useCollectionSearchQuery from "@dashboard/searches/useCollectionSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export const useCollectionSearch = (channel: string) => {
  const {
    loadMore: loadMoreCollections,
    search: searchCollections,
    result: searchCollectionsOpts,
  } = useCollectionSearchQuery({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      channel,
    },
    skip: !channel,
  });

  const fetchMoreCollections = getSearchFetchMoreProps(
    searchCollectionsOpts,
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
