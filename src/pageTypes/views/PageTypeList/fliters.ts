import { IFilterElement } from "@saleor/components/Filter";
import {
  PageTypeFilterKeys,
  PageTypeListFilterOpts
} from "@saleor/pageTypes/components/PageTypeListPage";
import { PageTypeFilterInput } from "@saleor/types/globalTypes";

import {
  createFilterTabUtils,
  createFilterUtils,
  getSingleValueQueryParam
} from "../../../utils/filters";
import {
  PageTypeListUrlFilters,
  PageTypeListUrlFiltersEnum,
  PageTypeListUrlQueryParams
} from "../../urls";

export const PAGE_TYPE_FILTERS_KEY = "pageTypeFilters";

export function getFilterOpts(
  _params: PageTypeListUrlFilters
): PageTypeListFilterOpts {
  return {};
}

export function getFilterVariables(
  params: PageTypeListUrlFilters
): PageTypeFilterInput {
  return {
    search: params.query
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<PageTypeFilterKeys>
): PageTypeListUrlFilters {
  const { name } = filter;

  switch (name) {
    case PageTypeFilterKeys.type:
      return getSingleValueQueryParam(filter, PageTypeListUrlFiltersEnum.type);
  }
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<PageTypeListUrlFilters>(PAGE_TYPE_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  PageTypeListUrlQueryParams,
  PageTypeListUrlFilters
>(PageTypeListUrlFiltersEnum);
