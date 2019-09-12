import { ProductTypeFilterInput } from "@saleor/types/globalTypes";
import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";
import {
  ProductTypeListUrlFilters,
  ProductTypeListUrlFiltersEnum,
  ProductTypeListUrlQueryParams
} from "../../urls";

export const PRODUCT_TYPE_FILTERS_KEY = "productTypeFilters";

export function getFilterVariables(
  params: ProductTypeListUrlFilters
): ProductTypeFilterInput {
  return {
    search: params.query
  };
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<ProductTypeListUrlFilters>(PRODUCT_TYPE_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  ProductTypeListUrlQueryParams,
  ProductTypeListUrlFilters
>(ProductTypeListUrlFiltersEnum);
