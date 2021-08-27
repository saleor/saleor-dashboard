import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import { OrderPaymentStatusEnum } from "@saleor/types/globalTypes";

import {
  getFulfilledFulfillemnts,
  getUnfulfilledLines
} from "../OrderReturnPage/utils";

export const hasAnyItemsReplaceable = (order?: OrderDetails_order) => {
  if (!order) {
    return false;
  }

  const hasAnyUnfulfilledItems = getUnfulfilledLines(order).length > 0;

  const hasAnyFulfilmentsToReturn = getFulfilledFulfillemnts(order).length > 0;

  return hasAnyUnfulfilledItems || hasAnyFulfilmentsToReturn;
};

export const isOverpaid = (order?: OrderDetails_order) => {
  if (!order) {
    return false;
  }

  return order.paymentStatus === OrderPaymentStatusEnum.OVERPAID;
};

export interface ConditionalItem {
  shouldExist: boolean;
  item: any;
}

export const filteredConditionalItems = (items: ConditionalItem[]) =>
  items.filter(({ shouldExist }) => shouldExist).map(({ item }) => item);
