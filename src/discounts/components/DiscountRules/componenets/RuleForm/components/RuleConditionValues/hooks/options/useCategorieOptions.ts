import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { CommonSearchOpts } from "@dashboard/hooks/makeTopLevelSearch/types";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import useCategorySearch from "@dashboard/searches/useCategorySearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export const useCategorieOptions = (channel: string | null, conditionId: string | null) => {
  const {
    loadMore: loadMoreCategories,
    search: searchCategories,
    result: searchCategoriesOpts,
  } = useCategorySearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
    skip: !channel || !conditionId || conditionId !== "category",
  });
  const fetchMoreCategories = getSearchFetchMoreProps(
    searchCategoriesOpts as CommonSearchOpts,
    loadMoreCategories,
  );

  return {
    fetch: searchCategories,
    fetchMoreProps: fetchMoreCategories,
    options: (mapEdgesToItems(searchCategoriesOpts?.data?.search) ?? []).map(({ name, id }) => ({
      label: name,
      value: id,
    })),
  };
};
