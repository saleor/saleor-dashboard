// @ts-strict-ignore
import { FilterContainer } from "@dashboard/components/ConditionalFilter/FilterElement";
import { creatDraftOrderQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";

import { createFilterTabUtils, createFilterUtils } from "../../../utils/filters";
import {
  OrderDraftListUrlFilters,
  OrderDraftListUrlFiltersEnum,
  OrderDraftListUrlQueryParams,
} from "../../urls";

export const ORDER_DRAFT_FILTERS_KEY = "orderDraftFilters";

export const getFilterVariables = ({
  filterContainer,
  params,
}: {
  filterContainer: FilterContainer;
  params: OrderDraftListUrlFilters;
}) => {
  const queryVars = creatDraftOrderQueryVariables(filterContainer);

  return {
    ...queryVars,
    search: params.query,
  };
};

export const storageUtils = createFilterTabUtils<string>(ORDER_DRAFT_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } = createFilterUtils<
  OrderDraftListUrlQueryParams,
  OrderDraftListUrlFilters
>(OrderDraftListUrlFiltersEnum);
