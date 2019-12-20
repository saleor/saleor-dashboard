import { IntlShape } from "react-intl";

import { findInEnum, maybe, orderStatusMessages } from "@saleor/misc";
import {
  createDateField,
  createOptionsField
} from "@saleor/utils/filters/fields";
import { IFilter, IFilterElement } from "../../../components/Filter";
import {
  OrderFilterInput,
  OrderStatusFilter,
  OrderStatus
} from "../../../types/globalTypes";
import {
  createFilterTabUtils,
  createFilterUtils,
  dedupeFilter
} from "../../../utils/filters";
import {
  OrderListUrlFilters,
  OrderListUrlFiltersEnum,
  OrderListUrlFiltersWithMultipleValuesEnum,
  OrderListUrlQueryParams
} from "../../urls";
import messages from "./messages";

export const ORDER_FILTERS_KEY = "orderFilters";

export enum OrderFilterKeys {
  created = "created",
  status = "status"
}

export function createFilterStructure(
  intl: IntlShape,
  params: OrderListUrlFilters
): IFilter<OrderFilterKeys> {
  return [
    {
      ...createDateField(
        OrderFilterKeys.created,
        intl.formatMessage(messages.placed),
        {
          max: maybe(() => params.createdTo, ""),
          min: maybe(() => params.createdFrom, "")
        }
      ),
      active: maybe(
        () =>
          [params.createdFrom, params.createdTo].some(
            field => field !== undefined
          ),
        false
      )
    },
    {
      ...createOptionsField(
        OrderFilterKeys.status,
        intl.formatMessage(messages.status),
        maybe(
          () =>
            dedupeFilter(
              params.status.map(status => findInEnum(status, OrderStatusFilter))
            ),
          []
        ),
        true,
        [
          {
            label: intl.formatMessage(orderStatusMessages.cancelled),
            value: OrderStatusFilter.CANCELED
          },
          {
            label: intl.formatMessage(orderStatusMessages.fulfilled),
            value: OrderStatusFilter.FULFILLED
          },
          {
            label: intl.formatMessage(orderStatusMessages.partiallyFulfilled),
            value: OrderStatusFilter.PARTIALLY_FULFILLED
          },
          {
            label: intl.formatMessage(orderStatusMessages.unfulfilled),
            value: OrderStatusFilter.UNFULFILLED
          }
        ]
      ),
      active: maybe(() => params.status !== undefined, false)
    }
  ];
}

export function getFilterVariables(
  params: OrderListUrlFilters
): OrderFilterInput {
  return {
    created: {
      gte: params.createdFrom,
      lte: params.createdTo
    },
    customer: params.email,
    search: params.query,
    status: maybe(() =>
      params.status.map(status => findInEnum(status, OrderStatusFilter))
    )
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<OrderFilterKeys>
): OrderListUrlFilters {
  const { active, name, value } = filter;

  if (active) {
    switch (name) {
      case OrderFilterKeys.created:
        return {
          createdFrom: value[0],
          createdTo: value[1]
        };

      case OrderFilterKeys.status:
        return {
          status: value.map(val => findInEnum(val, OrderStatus))
        };
    }
  }
}
export function createFilterQueryParams(
  filter: IFilter<OrderFilterKeys>
): OrderListUrlFilters {
  return filter.reduce(
    (acc, filterField) => ({
      ...acc,
      ...getFilterQueryParam(filterField)
    }),
    {}
  );
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
