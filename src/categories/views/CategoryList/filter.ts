import { type CategoryFilterInput } from "@dashboard/graphql";

import { createFilterUtils } from "../../../utils/filters/filters";
import { createFilterTabUtils } from "../../../utils/filters/storage";
import {
  type CategoryListUrlFilters,
  CategoryListUrlFiltersEnum,
  type CategoryListUrlQueryParams,
} from "../../urls";

const CATEGORY_FILTERS_KEY = "categoryFilters";

export function getFilterVariables(params: CategoryListUrlFilters): CategoryFilterInput {
  return {
    search: params.query,
  };
}

export const storageUtils = createFilterTabUtils<string>(CATEGORY_FILTERS_KEY);

export const { getActiveFilters } = createFilterUtils<
  CategoryListUrlQueryParams,
  CategoryListUrlFilters
>(CategoryListUrlFiltersEnum);
