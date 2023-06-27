// @ts-strict-ignore
import camelCase from "lodash/camelCase";

import { orderTitleMessages } from "./messages";
import { CardTitleLines, CardTitleStatus } from "./OrderCardTitle";

export const getOrderTitleMessage = (status: CardTitleStatus) =>
  orderTitleMessages[camelCase(status)] || orderTitleMessages.unfulfilled;

export const getFulfillmentTotalQuantity = (
  lines: CardTitleLines,
  status: CardTitleStatus,
) =>
  status === "unfulfilled"
    ? lines.reduce(
        (resultQuantity, line) =>
          resultQuantity + (line.quantityToFulfill ?? line.quantity),
        0,
      )
    : lines.reduce(
        (resultQuantity, { quantity }) => resultQuantity + quantity,
        0,
      );
