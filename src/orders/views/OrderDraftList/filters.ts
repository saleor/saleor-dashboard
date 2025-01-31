// @ts-strict-ignore
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
