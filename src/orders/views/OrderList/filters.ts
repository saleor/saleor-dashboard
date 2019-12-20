import { IntlShape } from "react-intl";

import {
  findInEnum,
  maybe,
  orderStatusMessages,
  findValueInEnum
} from "@saleor/misc";
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
import { OrderListFilterOpts } from "../../types";
import messages from "./messages";

export const ORDER_FILTERS_KEY = "orderFilters";

export enum OrderFilterKeys {
  created = "created",
  status = "status"
}

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

export function createFilterStructure(
  intl: IntlShape,
  opts: OrderListFilterOpts
): IFilter<OrderFilterKeys> {
  return [
    {
      ...createDateField(
        OrderFilterKeys.created,
        intl.formatMessage(messages.placed),
        opts.created.value
      ),
      active: opts.created.active
    },
    {
      ...createOptionsField(
        OrderFilterKeys.status,
        intl.formatMessage(messages.status),
        opts.status.value,
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
      active: opts.status.active
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
  const { active, multiple, name, value } = filter;

  if (active) {
    switch (name) {
      case OrderFilterKeys.created:
        if (multiple) {
          return {
            createdFrom: value[0],
            createdTo: value[1]
          };
        }

        return {
          createdFrom: value[0],
          createdTo: value[0]
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
