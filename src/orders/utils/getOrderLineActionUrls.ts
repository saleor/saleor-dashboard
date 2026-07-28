import { FulfillmentStatus, type OrderDetailsFragment } from "@dashboard/graphql";

import { getUnfulfilledLines } from "../components/OrderReturnPage/utils";
import { orderFulfillUrl, orderReturnUrl } from "../urls";
import { getOrderRefundNavigation } from "./getOrderRefundNavigation";

const RETURNABLE_FULFILLMENT_STATUSES = new Set<FulfillmentStatus>([
  FulfillmentStatus.FULFILLED,
  FulfillmentStatus.REFUNDED,
  FulfillmentStatus.WAITING_FOR_APPROVAL,
]);

export type OrderLineRowMenuContext =
  | { scope: "line" }
  | {
      scope: "timeline";
      segment: "unfulfilled" | "activeFulfillment" | "historicalFulfillment";
    };

export const getTimelineFulfillmentSegment = (
  status: FulfillmentStatus,
): "activeFulfillment" | "historicalFulfillment" => {
  if (status === FulfillmentStatus.FULFILLED || status === FulfillmentStatus.WAITING_FOR_APPROVAL) {
    return "activeFulfillment";
  }

  return "historicalFulfillment";
};

export const shouldOfferLineFulfillAction = (
  order: OrderDetailsFragment,
  lineId: string,
  context?: OrderLineRowMenuContext,
): boolean => {
  if (!hasLineFulfillableItems(order, lineId)) {
    return false;
  }

  if (!context || context.scope === "line") {
    return true;
  }

  return context.segment === "unfulfilled";
};

export const shouldOfferLineReturnAction = (
  order: OrderDetailsFragment,
  lineId: string,
  context?: OrderLineRowMenuContext,
): boolean => {
  if (!hasLineReturnableItems(order, lineId)) {
    return false;
  }

  if (!context || context.scope === "line") {
    return true;
  }

  return context.segment !== "historicalFulfillment";
};

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

export const hasLineFulfillableItems = (order: OrderDetailsFragment, lineId: string): boolean =>
  getUnfulfilledLines(order).some(line => line.id === lineId);

export const getOrderLineFulfillUrl = (orderId: string, lineId: string) =>
  orderFulfillUrl(orderId, { lineId });

export const getOrderLineReturnUrl = (orderId: string, lineId: string) =>
  orderReturnUrl(orderId, { lineId });

export const getOrderLineRefundUrl = (order: OrderDetailsFragment, lineId: string) =>
  getOrderRefundNavigation(order, { lineId }).url;
