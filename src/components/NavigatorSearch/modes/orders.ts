// @ts-strict-ignore
import { UseNavigatorResult } from "@dashboard/hooks/useNavigator";
import { maybe, transformOrderStatus } from "@dashboard/misc";
import { orderUrl } from "@dashboard/orders/urls";
import { IntlShape } from "react-intl";

import { QuickOrderSearchResult } from "../queries/useQuickOrderSearch";
import { QuickSearchAction } from "../types";
import messages from "./messages";

export function isQueryValidOrderNumber(query: string): boolean {
  return query === parseInt(query, 10).toString();
}

export function getGqlOrderId(orderNumber: string): string {
  return btoa(`Order:${orderNumber}`);
}

function getOrdersModeActions(
  intl: IntlShape,
  navigate: UseNavigatorResult,
  orders: QuickOrderSearchResult,
): QuickSearchAction[] {
  if (!orders) {
    return [];
  }

  return orders.map(order => {
    const orderNumber = maybe(() => order.number, "");

    return {
      extraInfo: transformOrderStatus(order.status, intl).localized,
      label: intl.formatMessage(messages.goToOrder, {
        orderNumber,
      }),
      onClick: () => {
        navigate(orderUrl(order.id));

        return false;
      },
      type: "action",
    };
  });
}

export default getOrdersModeActions;
