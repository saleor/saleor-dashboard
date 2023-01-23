import { CheckIfOrderExistsQuery } from "@dashboard/graphql";
import { UseNavigatorResult } from "@dashboard/hooks/useNavigator";
import { maybe, transformOrderStatus } from "@dashboard/misc";
import { orderUrl } from "@dashboard/orders/urls";
import { IntlShape } from "react-intl";

import { QuickSearchAction } from "../types";
import messages from "./messages";

export function isQueryValidOrderNumber(query: string): boolean {
  return query === parseInt(query, 10).toString();
}

export function getGqlOrderId(orderNumber: string): string {
  return btoa(`Order:${orderNumber}`);
}

function getOrdersModeActions(
  query: string,
  intl: IntlShape,
  navigate: UseNavigatorResult,
  order: CheckIfOrderExistsQuery["order"],
): QuickSearchAction[] {
  const gqlId = getGqlOrderId(query);

  if (isQueryValidOrderNumber(query) && maybe(() => order.id === gqlId)) {
    return [
      {
        extraInfo: transformOrderStatus(order.status, intl).localized,
        label: intl.formatMessage(messages.goToOrder, {
          orderNumber: query,
        }),
        onClick: () => {
          navigate(orderUrl(gqlId));
          return false;
        },
        type: "action",
      },
    ];
  }

  return [];
}

export default getOrdersModeActions;
