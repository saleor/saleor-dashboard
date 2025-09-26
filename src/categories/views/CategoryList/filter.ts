import { CategoryFilterInput } from "@dashboard/graphql";

import { createFilterTabUtils, createFilterUtils } from "../../../utils/filters";
import {
  CategoryListUrlFilters,
  CategoryListUrlFiltersEnum,
  CategoryListUrlQueryParams,
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
