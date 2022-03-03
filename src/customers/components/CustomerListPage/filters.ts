import { IFilter } from "@saleor/components/Filter";
import { hasPermissions } from "@saleor/components/RequirePermissions";
import { User_userPermissions } from "@saleor/fragments/types/User";
import { FilterOpts, MinMax } from "@saleor/types";
import { PermissionEnum } from "@saleor/types/globalTypes";
import {
  createDateField,
  createNumberField
} from "@saleor/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

export enum CustomerFilterKeys {
  joined = "joined",
  numberOfOrders = "orders"
}

export interface CustomerListFilterOpts {
  joined: FilterOpts<MinMax>;
  numberOfOrders: FilterOpts<MinMax>;
}

const messages = defineMessages({
  joinDate: {
    defaultMessage: "Join Date",
    description: "customer"
  },
  numberOfOrders: {
    defaultMessage: "Number of Orders"
  }
});

export function createFilterStructure(
  intl: IntlShape,
  opts: CustomerListFilterOpts,
  userPermissions: User_userPermissions[]
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
        CustomerFilterKeys.numberOfOrders,
        intl.formatMessage(messages.numberOfOrders),
        opts.numberOfOrders.value
      ),
      active: opts.numberOfOrders.active,
      permissions: [PermissionEnum.MANAGE_ORDERS]
    }
  ].filter(filter => hasPermissions(userPermissions, filter.permissions ?? []));
}
