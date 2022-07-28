import { CategoryFilterInput } from "@saleor/graphql";

import {
  createFilterTabUtils,
  createFilterUtils,
} from "../../../utils/filters";
import {
  CategoryListUrlFilters,
  CategoryListUrlFiltersEnum,
  CategoryListUrlQueryParams,
} from "../../urls";

export const CATEGORY_FILTERS_KEY = "categoryFilters";

export function getFilterVariables(
  params: CategoryListUrlFilters,
): CategoryFilterInput {
  return {
    search: params.query,
  };
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab,
} = createFilterTabUtils<CategoryListUrlFilters>(CATEGORY_FILTERS_KEY);

export const {
  areFiltersApplied,
  getActiveFilters,
  getFiltersCurrentTab,
} = createFilterUtils<CategoryListUrlQueryParams, CategoryListUrlFilters>(
  CategoryListUrlFiltersEnum,
);
