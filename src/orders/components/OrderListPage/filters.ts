import { defineMessages, IntlShape } from "react-intl";

import { FilterOpts, MinMax } from "@saleor/types";
import { OrderStatusFilter } from "@saleor/types/globalTypes";
import {
  createDateField,
  createOptionsField,
  createTextField
} from "@saleor/utils/filters/fields";
import { IFilter } from "@saleor/components/Filter";
import { orderStatusMessages } from "@saleor/misc";
import { commonMessages } from "@saleor/intl";

export enum OrderFilterKeys {
  created = "created",
  customer = "customer",
  status = "status"
}

export interface OrderListFilterOpts {
  created: FilterOpts<MinMax>;
  customer: FilterOpts<string>;
  status: FilterOpts<OrderStatusFilter[]>;
}

const messages = defineMessages({
  customer: {
    defaultMessage: "Customer",
    description: "order"
  },
  placed: {
    defaultMessage: "Created",
    description: "order"
  }
});

export function createFilterStructure(
  intl: IntlShape,
  opts: OrderListFilterOpts
): IFilter<OrderFilterKeys> {
  return [
    {
      ...createTextField(
        OrderFilterKeys.customer,
        intl.formatMessage(messages.customer),
        opts.customer.value
      ),
      active: opts.customer.active
    },
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
        intl.formatMessage(commonMessages.status),
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
          },
          {
            label: intl.formatMessage(orderStatusMessages.readyToCapture),
            value: OrderStatusFilter.READY_TO_CAPTURE
          },
          {
            label: intl.formatMessage(orderStatusMessages.readyToFulfill),
            value: OrderStatusFilter.READY_TO_FULFILL
          }
        ]
      ),
      active: opts.status.active
    }
  ];
}
