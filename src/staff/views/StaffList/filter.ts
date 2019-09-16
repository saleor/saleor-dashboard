import { StaffUserInput } from "@saleor/types/globalTypes";
import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";
import {
  StaffListUrlFilters,
  StaffListUrlFiltersEnum,
  StaffListUrlQueryParams
} from "../../urls";

export const STAFF_FILTERS_KEY = "staffFilters";

export function getFilterVariables(
  params: StaffListUrlFilters
): StaffUserInput {
  return {
    search: params.query
  };
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<StaffListUrlFilters>(STAFF_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  StaffListUrlQueryParams,
  StaffListUrlFilters
>(StaffListUrlFiltersEnum);
