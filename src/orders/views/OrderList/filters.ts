import { defineMessages, IntlShape } from "react-intl";

import { findInEnum } from "@saleor/misc";
import { removeAtIndex } from "@saleor/utils/lists";
import { FilterContentSubmitData } from "../../../components/Filter";
import { Filter } from "../../../components/TableFilter";
import {
  OrderFilterInput,
  OrderStatusFilter
} from "../../../types/globalTypes";
import {
  arrayOrUndefined,
  arrayOrValue,
  createFilterTabUtils,
  createFilterUtils,
  dedupeFilter,
  valueOrFirst
} from "../../../utils/filters";
import { OrderFilterKeys } from "../../components/OrderListFilter";
import {
  OrderListUrlFilters,
  OrderListUrlFiltersEnum,
  OrderListUrlFiltersWithMultipleValuesEnum,
  OrderListUrlQueryParams
} from "../../urls";

export const ORDER_FILTERS_KEY = "orderFilters";

const filterMessages = defineMessages({
  dateFrom: {
    defaultMessage: "Date from {date}",
    description: "filter by date"
  },
  dateIs: {
    defaultMessage: "Date is {date}",
    description: "filter by date"
  },
  dateTo: {
    defaultMessage: "Date to {date}",
    description: "filter by date"
  },
  fulfilled: {
    defaultMessage: "Fulfilled",
    description: "order status"
  },
  partiallyFulfilled: {
    defaultMessage: "Partially Fulfilled",
    description: "order status"
  },
  readyToCapture: {
    defaultMessage: "Ready to Capture",
    description: "order status"
  },
  unfulfilled: {
    defaultMessage: "Unfulfilled",
    description: "order status"
  }
});

function getStatusLabel(status: string, intl: IntlShape): string {
  switch (status) {
    case OrderStatusFilter.FULFILLED.toString():
      return intl.formatMessage(filterMessages.fulfilled);

    case OrderStatusFilter.PARTIALLY_FULFILLED.toString():
      return intl.formatMessage(filterMessages.partiallyFulfilled);

    case OrderStatusFilter.UNFULFILLED.toString():
      return intl.formatMessage(filterMessages.unfulfilled);

    case OrderStatusFilter.READY_TO_CAPTURE.toString():
      return intl.formatMessage(filterMessages.readyToCapture);
  }

  return "";
}

export function getFilterVariables(
  params: OrderListUrlFilters
): OrderFilterInput {
  return {
    created: {
      gte: params.dateFrom,
      lte: params.dateTo
    },
    customer: params.email,
    search: params.query,
    status: Array.isArray(params.status)
      ? params.status.map(status => findInEnum(status, OrderStatusFilter))
      : params.status
      ? [findInEnum(params.status, OrderStatusFilter)]
      : undefined
  };
}

export function createFilter(
  filter: OrderListUrlFilters,
  data: FilterContentSubmitData<OrderFilterKeys>
): OrderListUrlFilters {
  const { name: filterName, value } = data;
  if (filterName === OrderFilterKeys.dateEqual) {
    return {
      dateFrom: valueOrFirst(value),
      dateTo: valueOrFirst(value)
    };
  } else if (filterName === OrderFilterKeys.dateRange) {
    return {
      dateFrom: value[0],
      dateTo: value[1]
    };
  } else if (
    [
      OrderFilterKeys.dateLastWeek,
      OrderFilterKeys.dateLastMonth,
      OrderFilterKeys.dateLastYear
    ].includes(filterName)
  ) {
    return {
      dateFrom: valueOrFirst(value),
      dateTo: undefined
    };
  } else if (filterName === OrderFilterKeys.status) {
    return {
      status: dedupeFilter(
        filter.status
          ? [...(filter.status as string[]), valueOrFirst(value)]
          : arrayOrValue(value)
      )
    };
  }
}

interface OrderListChipFormatData {
  formatDate: (date: string) => string;
}
export function createFilterChips(
  filters: OrderListUrlFilters,
  formatData: OrderListChipFormatData,
  onFilterDelete: (filters: OrderListUrlFilters) => void,
  intl: IntlShape
): Filter[] {
  let filterChips: Filter[] = [];

  if (!!filters.dateFrom || !!filters.dateTo) {
    if (filters.dateFrom === filters.dateTo) {
      filterChips = [
        ...filterChips,
        {
          label: intl.formatMessage(filterMessages.dateIs, {
            date: formatData.formatDate(filters.dateFrom)
          }),
          onClick: () =>
            onFilterDelete({
              ...filters,
              dateFrom: undefined,
              dateTo: undefined
            })
        }
      ];
    } else {
      if (!!filters.dateFrom) {
        filterChips = [
          ...filterChips,
          {
            label: intl.formatMessage(filterMessages.dateFrom, {
              date: formatData.formatDate(filters.dateFrom)
            }),
            onClick: () =>
              onFilterDelete({
                ...filters,
                dateFrom: undefined
              })
          }
        ];
      }

      if (!!filters.dateTo) {
        filterChips = [
          ...filterChips,
          {
            label: intl.formatMessage(filterMessages.dateTo, {
              date: formatData.formatDate(filters.dateTo)
            }),
            onClick: () =>
              onFilterDelete({
                ...filters,
                dateTo: undefined
              })
          }
        ];
      }
    }
  }

  if (!!filters.email) {
    filterChips = [
      ...filterChips,
      {
        label: filters.email,
        onClick: () =>
          onFilterDelete({
            ...filters,
            email: undefined
          })
      }
    ];
  }

  if (!!filters.status) {
    const statusFilterChips = Array.isArray(filters.status)
      ? filters.status.map((status, statusIndex) => ({
          label: getStatusLabel(status, intl),
          onClick: () =>
            onFilterDelete({
              ...filters,
              status: arrayOrUndefined(
                removeAtIndex(filters.status as string[], statusIndex)
              )
            })
        }))
      : [
          {
            label: getStatusLabel(filters.status, intl),
            onClick: () =>
              onFilterDelete({
                ...filters,
                status: undefined
              })
          }
        ];

    filterChips = [...filterChips, ...statusFilterChips];
  }

  return filterChips;
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
