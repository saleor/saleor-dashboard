import { IFilter } from "@saleor/components/Filter";
import { hasPermissions } from "@saleor/components/RequirePermissions";
import { PermissionEnum, UserFragment } from "@saleor/graphql";
import { FilterOpts, MinMax } from "@saleor/types";
import {
  createDateField,
  createNumberField,
} from "@saleor/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

export enum CustomerFilterKeys {
  joined = "joined",
  numberOfOrders = "orders",
}

export interface CustomerListFilterOpts {
  joined: FilterOpts<MinMax>;
  numberOfOrders: FilterOpts<MinMax>;
}

const messages = defineMessages({
  joinDate: {
    id: "icz/jb",
    defaultMessage: "Join Date",
    description: "customer",
  },
  numberOfOrders: {
    id: "fhksPD",
    defaultMessage: "Number of Orders",
  },
});

export function createFilterStructure(
  intl: IntlShape,
  opts: CustomerListFilterOpts,
  userPermissions: UserFragment["userPermissions"],
): IFilter<CustomerFilterKeys> {
  return [
    {
      ...createDateField(
        CustomerFilterKeys.joined,
        intl.formatMessage(messages.joinDate),
        opts.joined.value,
      ),
      active: opts.joined.active,
    },
    {
      ...createNumberField(
        CustomerFilterKeys.numberOfOrders,
        intl.formatMessage(messages.numberOfOrders),
        opts.numberOfOrders.value,
      ),
      active: opts.numberOfOrders.active,
      permissions: [PermissionEnum.MANAGE_ORDERS],
    },
  ].filter(filter => hasPermissions(userPermissions, filter.permissions ?? []));
}
