import { VoucherFilterInput } from "@saleor/types/globalTypes";
import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";
import {
  VoucherListUrlFilters,
  VoucherListUrlFiltersEnum,
  VoucherListUrlQueryParams
} from "../../urls";

export const VOUCHER_FILTERS_KEY = "VoucherFilters";

export function getFilterVariables(
  params: VoucherListUrlFilters
): VoucherFilterInput {
  return {
    search: params.query
  };
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<VoucherListUrlFilters>(VOUCHER_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  VoucherListUrlQueryParams,
  VoucherListUrlFilters
>(VoucherListUrlFiltersEnum);
