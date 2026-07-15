import { type OrderDetailsFragment } from "@dashboard/graphql";

import { orderPaymentRefundUrl, orderTransactionRefundUrl } from "../urls";
import { OrderDetailsViewModel } from "./OrderDetailsViewModel";

export interface OrderRefundNavigationOptions {
  lineId?: string;
}

export interface OrderRefundNavigation {
  url: string;
  canRefund: boolean;
  usesTransactionRefund: boolean;
}

export const getOrderRefundNavigation = (
  order: Pick<OrderDetailsFragment, "id" | "actions" | "transactions" | "payments">,
  options?: OrderRefundNavigationOptions,
): OrderRefundNavigation => {
  const canRefund = OrderDetailsViewModel.canOrderRefund(order.actions);
  const usesTransactionRefund = (order.transactions?.length ?? 0) > 0;
  const url = usesTransactionRefund
    ? orderTransactionRefundUrl(order.id, options?.lineId ? { lineId: options.lineId } : undefined)
    : orderPaymentRefundUrl(order.id);

  return {
    url,
    canRefund,
    usesTransactionRefund,
  };
};
