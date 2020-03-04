import { findInEnum, maybe, findValueInEnum } from "@saleor/misc";
import {
  OrderListFilterOpts,
  OrderFilterKeys
} from "@saleor/orders/components/OrderListPage/filters";
import { IFilterElement } from "../../../components/Filter";
import {
  OrderFilterInput,
  OrderStatusFilter
} from "../../../types/globalTypes";
import {
  createFilterTabUtils,
  createFilterUtils,
  dedupeFilter,
  getGteLteVariables,
  getMinMaxQueryParam,
  getMultipleEnumValueQueryParam,
  getSingleValueQueryParam
} from "../../../utils/filters";
import {
  OrderListUrlFilters,
  OrderListUrlFiltersEnum,
  OrderListUrlFiltersWithMultipleValuesEnum,
  OrderListUrlQueryParams
} from "../../urls";

export const ORDER_FILTERS_KEY = "orderFilters";

export function getFilterOpts(
  params: OrderListUrlFilters
): OrderListFilterOpts {
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
        max: maybe(() => params.createdTo, ""),
        min: maybe(() => params.createdFrom, "")
      }
    },
    customer: {
      active: !!maybe(() => params.customer),
      value: params.customer
    },
    status: {
      active: maybe(() => params.status !== undefined, false),
      value: maybe(
        () =>
          dedupeFilter(
            params.status.map(status =>
              findValueInEnum(status, OrderStatusFilter)
            )
          ),
        []
      )
    }
  };
}

export function getFilterVariables(
  params: OrderListUrlFilters
): OrderFilterInput {
  return {
    created: getGteLteVariables({
      gte: params.createdFrom,
      lte: params.createdTo
    }),
    customer: params.customer,
    search: params.query,
    status: maybe(() =>
      params.status.map(status => findInEnum(status, OrderStatusFilter))
    )
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<OrderFilterKeys>
): OrderListUrlFilters {
  const { name } = filter;

  switch (name) {
    case OrderFilterKeys.created:
      return getMinMaxQueryParam(
        filter,
        OrderListUrlFiltersEnum.createdFrom,
        OrderListUrlFiltersEnum.createdTo
      );

    case OrderFilterKeys.status:
      return getMultipleEnumValueQueryParam(
        filter,
        OrderListUrlFiltersWithMultipleValuesEnum.status,
        OrderStatusFilter
      );

    case OrderFilterKeys.customer:
      return getSingleValueQueryParam(filter, OrderListUrlFiltersEnum.customer);
  }
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<OrderListUrlFilters>(ORDER_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  OrderListUrlQueryParams,
  OrderListUrlFilters
>({
  ...OrderListUrlFiltersEnum,
  ...OrderListUrlFiltersWithMultipleValuesEnum
});
