import { type OrderDetailsFragment } from "@dashboard/graphql";
import { createContext, type ReactNode, useContext } from "react";

import { orderPaymentRefundUrl, orderTransactionRefundUrl } from "./urls";
import { OrderDetailsViewModel } from "./utils/OrderDetailsViewModel";

export interface OrderRefundNavigationOptions {
  lineId?: string;
}

export interface OrderRefundNavigation {
  url: string;
  canRefund: boolean;
}

/**
 * Where "refund this order/line" leads. Each payment mode provides its own
 * implementation at the concrete-view seam, so shared item and fulfillment
 * modules can offer a refund affordance without inspecting payments,
 * transactions or a payment-mode flag.
 */
export interface OrderRefundNavigationAdapter {
  getNavigation(options?: OrderRefundNavigationOptions): OrderRefundNavigation;
}

type RefundableOrder = Pick<OrderDetailsFragment, "id" | "actions">;

/** Legacy Payments API: one refund page per order, no line-level target. */
export const createLegacyRefundNavigationAdapter = (
  order: RefundableOrder,
): OrderRefundNavigationAdapter => ({
  getNavigation: () => ({
    url: orderPaymentRefundUrl(order.id),
    canRefund: OrderDetailsViewModel.canOrderRefund(order.actions),
  }),
});

/** Transactions API: refund page accepts an optional line to focus. */
export const createTransactionRefundNavigationAdapter = (
  order: RefundableOrder,
): OrderRefundNavigationAdapter => ({
  getNavigation: options => ({
    url: orderTransactionRefundUrl(
      order.id,
      options?.lineId ? { lineId: options.lineId } : undefined,
    ),
    canRefund: OrderDetailsViewModel.canOrderRefund(order.actions),
  }),
});

const OrderRefundNavigationContext = createContext<OrderRefundNavigationAdapter | null>(null);

export const OrderRefundNavigationProvider = ({
  adapter,
  children,
}: {
  adapter: OrderRefundNavigationAdapter;
  children: ReactNode;
}) => (
  <OrderRefundNavigationContext.Provider value={adapter}>
    {children}
  </OrderRefundNavigationContext.Provider>
);

/** For non-component consumers (menu-item builders) that receive the adapter as an argument. */
export const useOrderRefundNavigationAdapter = (): OrderRefundNavigationAdapter | null =>
  useContext(OrderRefundNavigationContext);

/**
 * `null` outside a concrete order view (isolated stories, datagrid unit tests):
 * with no payment mode resolved there is no refund destination, so consumers
 * hide the affordance rather than guess a mode.
 */
export const useOrderRefundNavigation = (
  options?: OrderRefundNavigationOptions,
): OrderRefundNavigation | null =>
  useOrderRefundNavigationAdapter()?.getNavigation(options) ?? null;
