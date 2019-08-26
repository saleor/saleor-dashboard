import moment from "moment-timezone";
import React from "react";
import { useIntl } from "react-intl";

import { DateContext } from "@saleor/components/Date/DateContext";
import { FieldType, IFilter } from "@saleor/components/Filter";
import FilterBar from "@saleor/components/FilterBar";
import TimezoneContext from "@saleor/components/Timezone";
import { FilterProps } from "../../../types";
import { OrderStatusFilter } from "../../../types/globalTypes";
import { OrderListUrlFilters } from "../../urls";

type OrderListFilterProps = FilterProps<OrderListUrlFilters>;

export enum OrderFilterKeys {
  date,
  dateEqual,
  dateRange,
  dateLastWeek,
  dateLastMonth,
  dateLastYear,
  email,
  fulfillment
}

const OrderListFilter: React.FC<OrderListFilterProps> = props => {
  const date = React.useContext(DateContext);
  const tz = React.useContext(TimezoneContext);
  const intl = useIntl();

  const filterMenu: IFilter = [
    {
      children: [
        {
          children: [],
          data: {
            fieldLabel: null,
            type: FieldType.hidden,
            value: (tz ? moment(date).tz(tz) : moment(date))
              .subtract(7, "days")
              .toISOString()
              .split("T")[0] // Remove timezone
          },
          label: intl.formatMessage({
            defaultMessage: "Last 7 Days"
          }),
          value: OrderFilterKeys.dateLastWeek.toString()
        },
        {
          children: [],
          data: {
            fieldLabel: null,
            type: FieldType.hidden,
            value: (tz ? moment(date).tz(tz) : moment(date))
              .subtract(30, "days")
              .toISOString()
              .split("T")[0] // Remove timezone
          },
          label: intl.formatMessage({
            defaultMessage: "Last 30 Days"
          }),
          value: OrderFilterKeys.dateLastMonth.toString()
        },
        {
          children: [],
          data: {
            fieldLabel: null,
            type: FieldType.hidden,
            value: (tz ? moment(date).tz(tz) : moment(date))
              .subtract(1, "years")
              .toISOString()
              .split("T")[0] // Remove timezone
          },
          label: intl.formatMessage({
            defaultMessage: "Last Year"
          }),
          value: OrderFilterKeys.dateLastYear.toString()
        },
        {
          children: [],
          data: {
            additionalText: intl.formatMessage({
              defaultMessage: "equals"
            }),
            fieldLabel: null,
            type: FieldType.date
          },
          label: intl.formatMessage({
            defaultMessage: "Specific Date"
          }),
          value: OrderFilterKeys.dateEqual.toString()
        },
        {
          children: [],
          data: {
            fieldLabel: intl.formatMessage({
              defaultMessage: "Range"
            }),
            type: FieldType.rangeDate
          },
          label: intl.formatMessage({
            defaultMessage: "Range"
          }),
          value: OrderFilterKeys.dateRange.toString()
        }
      ],
      data: {
        fieldLabel: intl.formatMessage({
          defaultMessage: "Date"
        }),
        type: FieldType.select
      },
      label: intl.formatMessage({
        defaultMessage: "Date"
      }),
      value: OrderFilterKeys.date.toString()
    },
    {
      children: [],
      data: {
        additionalText: intl.formatMessage({
          defaultMessage: "is set as",
          description: "date is set as"
        }),
        fieldLabel: intl.formatMessage({
          defaultMessage: "Status",
          description: "order fulfillment status"
        }),
        options: [
          {
            label: intl.formatMessage({
              defaultMessage: "Fulfilled",
              description: "order fulfillment status"
            }),
            value: OrderStatusFilter.FULFILLED.toString()
          },
          {
            label: intl.formatMessage({
              defaultMessage: "Partially Fulfilled",
              description: "order fulfillment status"
            }),
            value: OrderStatusFilter.PARTIALLY_FULFILLED.toString()
          },
          {
            label: intl.formatMessage({
              defaultMessage: "Unfulfilled",
              description: "order fulfillment status"
            }),
            value: OrderStatusFilter.UNFULFILLED.toString()
          }
        ],
        type: FieldType.select
      },
      label: intl.formatMessage({
        defaultMessage: "Fulfillment Status",
        description: "order"
      }),
      value: OrderFilterKeys.fulfillment.toString()
    }
  ];

  return <FilterBar {...props} filterMenu={filterMenu} />;
};
OrderListFilter.displayName = "OrderListFilter";
export default OrderListFilter;
