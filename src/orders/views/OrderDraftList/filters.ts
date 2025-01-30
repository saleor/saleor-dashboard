// @ts-strict-ignore
import { FilterContainer } from "@dashboard/components/ConditionalFilter/FilterElement";
import { creatDraftOrderQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import { FilterElement } from "@dashboard/components/Filter";

import {
  createFilterTabUtils,
  createFilterUtils,
  getMinMaxQueryParam,
  getSingleValueQueryParam,
} from "../../../utils/filters";
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

export enum OrderDraftFilterKeys {
  created = "created",
  customer = "customer",
}

export function getFilterQueryParam(
  filter: FilterElement<OrderDraftFilterKeys>,
): OrderDraftListUrlFilters {
  const { name } = filter;

  switch (name) {
    case OrderDraftFilterKeys.created:
      return getMinMaxQueryParam(
        filter,
        OrderDraftListUrlFiltersEnum.createdFrom,
        OrderDraftListUrlFiltersEnum.createdTo,
      );

    case OrderDraftFilterKeys.customer:
      return getSingleValueQueryParam(filter, OrderDraftListUrlFiltersEnum.customer);
  }
}

export const storageUtils = createFilterTabUtils<string>(ORDER_DRAFT_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } = createFilterUtils<
  OrderDraftListUrlQueryParams,
  OrderDraftListUrlFilters
>(OrderDraftListUrlFiltersEnum);
