import { SaleFilterInput } from "@saleor/types/globalTypes";
import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";
import {
  SaleListUrlFilters,
  SaleListUrlFiltersEnum,
  SaleListUrlQueryParams
} from "../../urls";

export const SALE_FILTERS_KEY = "saleFilters";

export function getFilterVariables(
  params: SaleListUrlFilters
): SaleFilterInput {
  return {
    search: params.query
  };
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<SaleListUrlFilters>(SALE_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  SaleListUrlQueryParams,
  SaleListUrlFilters
>(SaleListUrlFiltersEnum);
