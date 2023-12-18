import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { CommonSearchOpts } from "@dashboard/hooks/makeTopLevelSearch/types";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import useCategorySearch from "@dashboard/searches/useCategorySearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export const useCategorieOptions = () => {
  const {
    loadMore: loadMoreCategories,
    search: searchCategories,
    result: searchCategoriesOpts,
  } = useCategorySearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });

  const fetchMoreCategories = getSearchFetchMoreProps(
    searchCategoriesOpts as CommonSearchOpts,
    loadMoreCategories,
  );

  return {
    fetch: searchCategories,
    fetchMoreProps: fetchMoreCategories,
    options: (mapEdgesToItems(searchCategoriesOpts?.data?.search) ?? []).map(
      category => ({
        label: category.name,
        value: category.id,
      }),
    ),
  };
};
