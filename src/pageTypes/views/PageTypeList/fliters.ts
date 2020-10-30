import { PageTypeFilterInput } from "@saleor/types/globalTypes";

import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";
import {
  PageTypeListUrlFilters,
  PageTypeListUrlFiltersEnum,
  PageTypeListUrlQueryParams
} from "../../urls";

export const PAGE_TYPE_FILTERS_KEY = "pageTypeFilters";

export function getFilterVariables(
  params: PageTypeListUrlFilters
): PageTypeFilterInput {
  return {
    search: params.query
  };
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
