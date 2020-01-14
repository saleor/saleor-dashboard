import { OrderDraftFilterInput } from "@saleor/types/globalTypes";
import { maybe } from "@saleor/misc";
import { IFilterElement } from "@saleor/components/Filter";
import {
  OrderDraftFilterKeys,
  OrderDraftListFilterOpts
} from "@saleor/orders/components/OrderDraftListPage";
import {
  OrderDraftListUrlFilters,
  OrderDraftListUrlFiltersEnum,
  OrderDraftListUrlQueryParams
} from "../../urls";
import {
  createFilterTabUtils,
  createFilterUtils,
  getGteLteVariables,
  getMinMaxQueryParam,
  getSingleValueQueryParam
} from "../../../utils/filters";

export const ORDER_DRAFT_FILTERS_KEY = "orderDraftFilters";

export function getFilterOpts(
  params: OrderDraftListUrlFilters
): OrderDraftListFilterOpts {
  return {
    created: {
      active: maybe(
        () =>
          [params.createdFrom, params.createdTo].some(
            field => field !== undefined
          ),
        false
      ),
      value: {
        max: maybe(() => params.createdTo),
        min: maybe(() => params.createdFrom)
      }
    },
    customer: {
      active: !!maybe(() => params.customer),
      value: params.customer
    }
  };
}

export function getFilterVariables(
  params: OrderDraftListUrlFilters
): OrderDraftFilterInput {
  return {
    created: getGteLteVariables({
      gte: params.createdFrom,
      lte: params.createdTo
    }),
    customer: params.customer,
    search: params.query
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<OrderDraftFilterKeys>
): OrderDraftListUrlFilters {
  const { name } = filter;

  switch (name) {
    case OrderDraftFilterKeys.created:
      return getMinMaxQueryParam(
        filter,
        OrderDraftListUrlFiltersEnum.createdFrom,
        OrderDraftListUrlFiltersEnum.createdTo
      );

    case OrderDraftFilterKeys.customer:
      return getSingleValueQueryParam(
        filter,
        OrderDraftListUrlFiltersEnum.customer
      );
  }
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
