import { OrderStatus } from "@dashboard/graphql";
import { type ReactNode } from "react";

import { OrderStatusInlinePill } from "./OrderStatusInlinePill";

/** Fresh element instances per call — never reuse the same React node in multiple parents. */
export const createOrderStatusPills = (): Record<string, ReactNode> => ({
  unfulfilled: <OrderStatusInlinePill status={OrderStatus.UNFULFILLED} />,
  unconfirmed: <OrderStatusInlinePill status={OrderStatus.UNCONFIRMED} />,
  fulfilled: <OrderStatusInlinePill status={OrderStatus.FULFILLED} />,
});
