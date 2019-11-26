import { IntlShape } from "react-intl";

import { UseNavigatorResult } from "@saleor/hooks/useNavigator";
import { maybe, transformOrderStatus } from "@saleor/misc";
import { orderUrl } from "@saleor/orders/urls";
import { CheckIfOrderExists_order } from "../queries/types/CheckIfOrderExists";
import { QuickSearchAction } from "../types";
import messages from "./messages";

export function isQueryValidOrderNumber(query: string): boolean {
  return query === parseInt(query, 0).toString();
}

export function getGqlOrderId(orderNumber: string): string {
  return btoa(`Order:${orderNumber}`);
}

function getOrdersModeActions(
  query: string,
  intl: IntlShape,
  navigate: UseNavigatorResult,
  order: CheckIfOrderExists_order
): QuickSearchAction[] {
  const gqlId = getGqlOrderId(query);

  if (isQueryValidOrderNumber(query) && maybe(() => order.id === gqlId)) {
    return [
      {
        extraInfo: transformOrderStatus(order.status, intl).localized,
        label: intl.formatMessage(messages.goToOrder, {
          orderNumber: query
        }),
        onClick: () => {
          navigate(orderUrl(gqlId));
          return false;
        },
        type: "action"
      }
    ];
  }

  return [];
}

export default getOrdersModeActions;
