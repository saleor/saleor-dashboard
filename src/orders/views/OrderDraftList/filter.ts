import { OrderDraftFilterInput } from "@saleor/types/globalTypes";
import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";
import {
  OrderDraftListUrlFilters,
  OrderDraftListUrlFiltersEnum,
  OrderDraftListUrlQueryParams
} from "../../urls";

export const ORDER_DRAFT_FILTERS_KEY = "orderDraftFilters";

export function getFilterVariables(
  params: OrderDraftListUrlFilters
): OrderDraftFilterInput {
  return {
    search: params.query
  };
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<OrderDraftListUrlFilters>(ORDER_DRAFT_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  OrderDraftListUrlQueryParams,
  OrderDraftListUrlFilters
>(OrderDraftListUrlFiltersEnum);
