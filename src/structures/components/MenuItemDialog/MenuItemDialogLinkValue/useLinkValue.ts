import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import useCategorySearch from "@dashboard/searches/useCategorySearch";
import useCollectionSearch from "@dashboard/searches/useCollectionSearch";
import usePageSearch from "@dashboard/searches/usePageSearch";
import { FetchMoreProps } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { MenuItemTypeWithOptions } from "../types";

export const useLinkValue = (linkType: MenuItemTypeWithOptions) => {
  const categorySearch = useCategorySearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
    skip: linkType !== "category",
  });
  const collectionSearch = useCollectionSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
    skip: linkType !== "collection",
  });
  const pageSearch = usePageSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
    skip: linkType !== "page",
  });

  const searches = {
    category: categorySearch,
    collection: collectionSearch,
    page: pageSearch,
  };

  const selectedLinkTypeSearch = searches[linkType];

  const handleQueryChange = (query: string) => {
    if (selectedLinkTypeSearch) {
      selectedLinkTypeSearch.search(query);
    }
  };

  const fetchMoreProps: FetchMoreProps = {
    hasMore: selectedLinkTypeSearch?.result?.data?.search?.pageInfo?.hasNextPage ?? false,
    loading: selectedLinkTypeSearch?.result?.loading,
    onFetchMore: selectedLinkTypeSearch?.loadMore,
  };

  const categories = mapEdgesToItems(categorySearch?.result?.data?.search) || [];
  const collections = mapEdgesToItems(collectionSearch?.result?.data?.search) || [];
  const pages = mapEdgesToItems(pageSearch?.result?.data?.search) || [];

  const categoriesOptions = categories?.map(category => ({
    value: category.id,
    label: category.name,
  }));
  const collectionsOptions = collections?.map(collection => ({
    value: collection.id,
    label: collection.name,
  }));
  const pagesOptions = pages?.map(page => ({
    value: page.id,
    label: page.title,
  }));

  const options = {
    category: categoriesOptions,
    collection: collectionsOptions,
    page: pagesOptions,
  };

  return {
    options: options[linkType],
    fetchMoreProps,
    onQueryChange: handleQueryChange,
    loading: selectedLinkTypeSearch?.result?.loading,
  };
};
