import { IFilter, IFilterElement } from "@saleor/components/Filter";
import { SearchWithFetchMoreProps } from "@saleor/giftCards/GiftCardsList/GiftCardListSearchAndFilters/types";
import {
  PageListUrlFilters,
  PageListUrlFiltersWithMultipleValues,
  PageListUrlSort
} from "@saleor/pages/urls";
import { SearchPageTypes_search_edges_node } from "@saleor/searches/types/SearchPageTypes";
import {
  ActiveTab,
  AutocompleteFilterOpts,
  FilterOpts,
  Pagination,
  Search
} from "@saleor/types";
import {
  createFilterTabUtils,
  createFilterUtils,
  getMultipleValueQueryParam
} from "@saleor/utils/filters";
import { createAutocompleteField } from "@saleor/utils/filters/fields";
import {
  mapNodeToChoice,
  mapSingleValueNodeToChoice
} from "@saleor/utils/maps";
import { defineMessages, IntlShape } from "react-intl";

export enum PageListFilterKeys {
  pageType = "pageType"
}

export const PAGES_FILTERS_KEY = "pagesFilters";

export interface PageListFilterOpts {
  pageType: FilterOpts<string[]> & AutocompleteFilterOpts;
}

const messages = defineMessages({
  pageType: {
    defaultMessage: "Page Types",
    description: "Types"
  }
});

interface PageListFilterOptsProps {
  params: PageListUrlFilters;
  pageTypes: SearchPageTypes_search_edges_node[];
  pageTypesProps: SearchWithFetchMoreProps;
}

export const getFilterOpts = ({
  params,
  pageTypes,
  pageTypesProps
}: PageListFilterOptsProps): PageListFilterOpts => ({
  pageType: {
    active: !!params?.pageType,
    value: params?.pageType,
    choices: mapNodeToChoice(pageTypes),
    displayValues: mapSingleValueNodeToChoice(pageTypes),
    initialSearch: "",
    hasMore: pageTypesProps.hasMore,
    loading: pageTypesProps.loading,
    onFetchMore: pageTypesProps.onFetchMore,
    onSearchChange: pageTypesProps.onSearchChange
  }
});

export function createFilterStructure(
  intl: IntlShape,
  opts: PageListFilterOpts
): IFilter<PageListFilterKeys> {
  return [
    {
      ...createAutocompleteField(
        PageListFilterKeys.pageType,
        intl.formatMessage(messages.pageType),
        opts.pageType.value,
        opts.pageType.displayValues,
        true,
        opts.pageType.choices,
        {
          hasMore: opts.pageType.hasMore,
          initialSearch: "",
          loading: opts.pageType.loading,
          onFetchMore: opts.pageType.onFetchMore,
          onSearchChange: opts.pageType.onSearchChange
        }
      ),
      active: opts.pageType.active
    }
  ];
}

export function getFilterQueryParam(
  filter: IFilterElement<PageListFilterKeys>
): PageListUrlFilters {
  const { name } = filter;

  const { pageType } = PageListFilterKeys;

  switch (name) {
    case pageType:
      return getMultipleValueQueryParam(filter, name);
  }
}

export type PageListUrlQueryParams = Pagination &
  PageListUrlFilters &
  PageListUrlSort &
  ActiveTab &
  Search;

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<PageListUrlFilters>(PAGES_FILTERS_KEY);

export const {
  areFiltersApplied,
  getActiveFilters,
  getFiltersCurrentTab
} = createFilterUtils<PageListUrlQueryParams, PageListUrlFilters>(
  PageListUrlFiltersWithMultipleValues
);
