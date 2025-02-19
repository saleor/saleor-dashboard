import { WarehouseFilterInput } from "@dashboard/graphql";

import { createFilterTabUtils, createFilterUtils } from "../../../utils/filters";
import {
  WarehouseListUrlFilters,
  WarehouseListUrlFiltersEnum,
  WarehouseListUrlQueryParams,
} from "../../urls";

export const WAREHOUSE_FILTERS_KEY = "warehouseFilters";

export function getFilterVariables(params: WarehouseListUrlFilters): WarehouseFilterInput {
  return {
    search: params.query,
  };
}

export const storageUtils = createFilterTabUtils<string>(WAREHOUSE_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } = createFilterUtils<
  WarehouseListUrlQueryParams,
  WarehouseListUrlFilters
>(WarehouseListUrlFiltersEnum);
