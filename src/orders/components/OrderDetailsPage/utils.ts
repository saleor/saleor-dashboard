import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";

import {
  getFulfilledFulfillemnts,
  getUnfulfilledLines,
  getWaitingFulfillments
} from "../OrderReturnPage/utils";

export const hasAnyItemsReplaceable = (order?: OrderDetails_order) => {
  if (!order) {
    return false;
  }

  const hasAnyUnfulfilledItems = getUnfulfilledLines(order).length > 0;

  const hasAnyWaitingLines = getWaitingFulfillments(order).length > 0;

  const hasAnyFulfilmentsToReturn = getFulfilledFulfillemnts(order).length > 0;

  return (
    hasAnyUnfulfilledItems || hasAnyFulfilmentsToReturn || hasAnyWaitingLines
  );
};

export interface ConditionalItem {
  shouldExist: boolean;
  item: any;
}

export const filteredConditionalItems = (items: ConditionalItem[]) =>
  items.filter(({ shouldExist }) => shouldExist).map(({ item }) => item);
