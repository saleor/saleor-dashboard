import { ServiceAccountFilterInput } from "@saleor/types/globalTypes";
import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";
import {
  ServiceListUrlFilters,
  ServiceListUrlFiltersEnum,
  ServiceListUrlQueryParams
} from "../../urls";

export const STAFF_FILTERS_KEY = "staffFilters";

export function getFilterVariables(
  params: ServiceListUrlFilters
): ServiceAccountFilterInput {
  return {
    search: params.query
  };
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<ServiceListUrlFilters>(STAFF_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  ServiceListUrlQueryParams,
  ServiceListUrlFilters
>(ServiceListUrlFiltersEnum);
