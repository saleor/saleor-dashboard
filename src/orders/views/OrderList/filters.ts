import { defineMessages, IntlShape } from "react-intl";

import { FilterContentSubmitData } from "../../../components/Filter";
import { Filter } from "../../../components/TableFilter";
import {
  OrderFilterInput,
  OrderStatusFilter
} from "../../../types/globalTypes";
import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";
import { OrderFilterKeys } from "../../components/OrderListFilter";
import {
  OrderListUrlFilters,
  OrderListUrlFiltersEnum,
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
    status: OrderStatusFilter[params.status]
  };
}

export function createFilter(
  filter: FilterContentSubmitData
): OrderListUrlFilters {
  const filterName = filter.name;
  if (filterName === OrderFilterKeys.dateEqual.toString()) {
    const value = filter.value as string;
    return {
      dateFrom: value,
      dateTo: value
    };
  } else if (filterName === OrderFilterKeys.dateRange.toString()) {
    const { value } = filter;
    return {
      dateFrom: value[0],
      dateTo: value[1]
    };
  } else if (
    [
      OrderFilterKeys.dateLastWeek,
      OrderFilterKeys.dateLastMonth,
      OrderFilterKeys.dateLastYear
    ]
      .map(value => value.toString())
      .includes(filterName)
  ) {
    const { value } = filter;
    return {
      dateFrom: value as string,
      dateTo: undefined
    };
  } else if (filterName === OrderFilterKeys.fulfillment.toString()) {
    const { value } = filter;
    return {
      status: value as string
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

  if (!!filters.status) {
    filterChips = [
      ...filterChips,
      {
        label: getStatusLabel(filters.status, intl),
        onClick: () =>
          onFilterDelete({
            ...filters,
            status: undefined
          })
      }
    ];
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
>(OrderListUrlFiltersEnum);
