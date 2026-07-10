import { type DotStatus } from "@dashboard/components/StatusDot/StatusDot";
import { orderTitleMessages } from "@dashboard/orders/components/OrderCardTitle/messages";
import { type OrderLineLifecycle } from "@dashboard/orders/utils/buildOrderLineLifecycle";
import { type IntlShape, type MessageDescriptor } from "react-intl";

import { messages } from "./messages";

export type OrderLineRollupStatus =
  | "waitingForApproval"
  | "partiallyFulfilled"
  | "toFulfill"
  | "fulfilled"
  | "partiallyReturned"
  | "returned"
  | "refunded"
  | "replaced";

/**
 * Derives a single rollup status per order line for at-a-glance scanning.
 * Priority favors actionable states (approval, partial ship) over terminal ones.
 */
export const getOrderLineRollupStatus = (lifecycle: OrderLineLifecycle): OrderLineRollupStatus => {
  const {
    ordered,
    toFulfill,
    shipped,
    pendingApproval,
    returned,
    refundedFulfillment,
    grantedRefund,
    replaced,
  } = lifecycle;

  if (pendingApproval > 0) {
    return "waitingForApproval";
  }

  if (toFulfill > 0 && shipped > 0) {
    return "partiallyFulfilled";
  }

  if (toFulfill > 0) {
    return "toFulfill";
  }

  if (ordered > 0 && returned >= ordered) {
    return "returned";
  }

  if (returned > 0) {
    return "partiallyReturned";
  }

  if (replaced > 0) {
    return "replaced";
  }

  if (refundedFulfillment > 0 || grantedRefund > 0) {
    return "refunded";
  }

  if (shipped > 0) {
    return "fulfilled";
  }

  return "toFulfill";
};

const ROLLUP_STATUS_MESSAGES: Record<OrderLineRollupStatus, MessageDescriptor> = {
  waitingForApproval: orderTitleMessages.waitingForApproval,
  partiallyFulfilled: messages.partiallyFulfilled,
  toFulfill: messages.toFulfillStatus,
  fulfilled: orderTitleMessages.fulfilled,
  partiallyReturned: messages.partiallyReturned,
  returned: orderTitleMessages.returned,
  refunded: orderTitleMessages.refunded,
  replaced: orderTitleMessages.replaced,
};

export const getOrderLineRollupStatusLabel = (
  status: OrderLineRollupStatus,
  intl: IntlShape,
): string => intl.formatMessage(ROLLUP_STATUS_MESSAGES[status]);

export const getOrderLineRollupDotStatus = (status: OrderLineRollupStatus): DotStatus => {
  switch (status) {
    case "fulfilled":
      return "success";
    case "returned":
    case "refunded":
      return "error";
    default:
      return "warning";
  }
};
