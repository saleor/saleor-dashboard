import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import useCategorySearchQuery from "@dashboard/searches/useCategorySearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export const useCategorieSearch = () => {
  const {
    loadMore: loadMoreCategories,
    search: searchCategories,
    result: searchCategoriesOpts,
  } = useCategorySearchQuery({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });

  const fetchMoreCategories = getSearchFetchMoreProps(
    searchCategoriesOpts,
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
