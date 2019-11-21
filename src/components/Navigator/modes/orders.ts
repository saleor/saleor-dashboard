import { IntlShape } from "react-intl";

import { orderUrl } from "@saleor/orders/urls";
import { QuickSearchAction } from "../types";
import messages from "./messages";

function getOrdersModeActions(
  query: string,
  intl: IntlShape
): QuickSearchAction[] {
  if (query === parseInt(query, 0).toString()) {
    return [
      {
        label: intl.formatMessage(messages.goToOrder, {
          orderNumber: query
        }),
        score: 1,
        type: "action",
        url: orderUrl(btoa(`Order:${query}`))
      }
    ];
  }

  return [];
}

export default getOrdersModeActions;
