// @ts-strict-ignore
import camelCase from "lodash/camelCase";

import { orderTitleMessages } from "./messages";
import { CardTitleStatus } from "./OrderCardTitle";

export const getOrderTitleMessage = (status: CardTitleStatus) =>
  orderTitleMessages[camelCase(status)] || orderTitleMessages.unfulfilled;
