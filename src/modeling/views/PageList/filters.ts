// @ts-strict-ignore
import { FilterElement } from "@dashboard/components/Filter/types";
import { SearchWithFetchMoreProps } from "@dashboard/giftCards/GiftCardsList/GiftCardListSearchAndFilters/types";
import { SearchPageTypesQuery } from "@dashboard/graphql";
import { PageListUrlFilters } from "@dashboard/modeling/urls";
import { AutocompleteFilterOpts, FilterOpts } from "@dashboard/types";
import { createFilterTabUtils, getMultipleValueQueryParam } from "@dashboard/utils/filters";
import { mapNodeToChoice, mapSingleValueNodeToChoice } from "@dashboard/utils/maps";

export enum PageListFilterKeys {
  pageTypes = "pageTypes",
}

const PAGES_FILTERS_KEY = "pagesFilters";

export interface PageListFilterOpts {
  pageType: FilterOpts<string[]> & AutocompleteFilterOpts;
}

interface PageListFilterOptsProps {
  params: PageListUrlFilters;
  pageTypes: Array<SearchPageTypesQuery["search"]["edges"][0]["node"]>;
  pageTypesProps: SearchWithFetchMoreProps;
}

export const getFilterOpts = ({
  params,
  pageTypes,
  pageTypesProps,
}: PageListFilterOptsProps): PageListFilterOpts => ({
  pageType: {
    active: !!params?.pageTypes,
    value: params?.pageTypes,
    choices: mapNodeToChoice(pageTypes),
    displayValues: mapSingleValueNodeToChoice(pageTypes),
    initialSearch: "",
    hasMore: pageTypesProps.hasMore,
    loading: pageTypesProps.loading,
    onFetchMore: pageTypesProps.onFetchMore,
    onSearchChange: pageTypesProps.onSearchChange,
  },
});

export function getFilterQueryParam(filter: FilterElement<PageListFilterKeys>): PageListUrlFilters {
  const { name } = filter;
  const { pageTypes } = PageListFilterKeys;

  switch (name) {
    case pageTypes:
      return getMultipleValueQueryParam(filter, name);
  }
}

export const storageUtils = createFilterTabUtils<string>(PAGES_FILTERS_KEY);
