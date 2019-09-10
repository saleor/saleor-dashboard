import { AttributeFilterInput } from "@saleor/types/globalTypes";
import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";
import {
  AttributeListUrlFilters,
  AttributeListUrlFiltersEnum,
  AttributeListUrlQueryParams
} from "../../urls";

export const PRODUCT_FILTERS_KEY = "productFilters";

export function getFilterVariables(
    params: AttributeListUrlFilters
  ): AttributeFilterInput {
    return {
      search: params.query
    };
  }

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<AttributeListUrlFilters>(PRODUCT_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  AttributeListUrlQueryParams,
  AttributeListUrlFilters
>(AttributeListUrlFiltersEnum);
