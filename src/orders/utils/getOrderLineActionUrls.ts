import { FulfillmentStatus, type OrderDetailsFragment } from "@dashboard/graphql";

import { getUnfulfilledLines } from "../components/OrderReturnPage/utils";
import { orderHasTransactions } from "../types";
import { orderPaymentRefundUrl, orderReturnUrl, orderTransactionRefundUrl } from "../urls";

const RETURNABLE_FULFILLMENT_STATUSES = new Set<FulfillmentStatus>([
  FulfillmentStatus.FULFILLED,
  FulfillmentStatus.REFUNDED,
  FulfillmentStatus.WAITING_FOR_APPROVAL,
]);

export const hasLineReturnableItems = (order: OrderDetailsFragment, lineId: string): boolean => {
  const hasUnfulfilledQuantity = getUnfulfilledLines(order).some(line => line.id === lineId);

  if (hasUnfulfilledQuantity) {
    return true;
  }

  return order.fulfillments?.some(
    fulfillment =>
      RETURNABLE_FULFILLMENT_STATUSES.has(fulfillment.status) &&
      fulfillment.lines?.some(fulfillmentLine => fulfillmentLine.orderLine?.id === lineId),
  );
};

export const getOrderLineReturnUrl = (orderId: string, lineId: string) =>
  orderReturnUrl(orderId, { lineId });

export const getOrderLineRefundUrl = (order: OrderDetailsFragment, lineId: string) => {
  if (orderHasTransactions(order)) {
    return orderTransactionRefundUrl(order.id, { lineId });
  }

  return orderPaymentRefundUrl(order.id);
};
