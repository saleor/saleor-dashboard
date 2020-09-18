import { WarehouseFilterInput } from "@saleor/types/globalTypes";

import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";
import {
  WarehouseListUrlFilters,
  WarehouseListUrlFiltersEnum,
  WarehouseListUrlQueryParams
} from "../../urls";

export const WAREHOUSE_FILTERS_KEY = "warehouseFilters";

export function getFilterVariables(
  params: WarehouseListUrlFilters
): WarehouseFilterInput {
  return {
    search: params.query
  };
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<WarehouseListUrlFilters>(WAREHOUSE_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  WarehouseListUrlQueryParams,
  WarehouseListUrlFilters
>(WarehouseListUrlFiltersEnum);
