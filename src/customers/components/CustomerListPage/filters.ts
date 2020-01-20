import { IntlShape, defineMessages } from "react-intl";

import { FilterOpts, MinMax } from "@saleor/types";
import { IFilter } from "@saleor/components/Filter";
import {
  createDateField,
  createNumberField
} from "@saleor/utils/filters/fields";

export enum CustomerFilterKeys {
  joined = "joined",
  moneySpent = "spent",
  numberOfOrders = "orders"
}

export interface CustomerListFilterOpts {
  joined: FilterOpts<MinMax>;
  moneySpent: FilterOpts<MinMax>;
  numberOfOrders: FilterOpts<MinMax>;
}

const messages = defineMessages({
  joinDate: {
    defaultMessage: "Join Date",
    description: "customer"
  },
  moneySpent: {
    defaultMessage: "Money Spent",
    description: "customer"
  },
  numberOfOrders: {
    defaultMessage: "Number of Orders"
  }
});

export function createFilterStructure(
  intl: IntlShape,
  opts: CustomerListFilterOpts
): IFilter<CustomerFilterKeys> {
  return [
    {
      ...createDateField(
        CustomerFilterKeys.joined,
        intl.formatMessage(messages.joinDate),
        opts.joined.value
      ),
      active: opts.joined.active
    },
    {
      ...createNumberField(
        CustomerFilterKeys.moneySpent,
        intl.formatMessage(messages.moneySpent),
        opts.moneySpent.value
      ),
      active: opts.moneySpent.active
    },
    {
      ...createNumberField(
        CustomerFilterKeys.numberOfOrders,
        intl.formatMessage(messages.numberOfOrders),
        opts.numberOfOrders.value
      ),
      active: opts.numberOfOrders.active
    }
  ];
}
