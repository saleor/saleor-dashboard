import { type OrderDetailsFragment, OrderGrantedRefundStatusEnum } from "@dashboard/graphql";

export type OrderLevelGrantedRefund = {
  id: string;
  status: OrderGrantedRefundStatusEnum;
  amount: { amount: number; currency: string };
  shippingCostsIncluded: boolean;
  reason?: string | null;
};

export const isOrderLevelGrantedRefund = (
  grantedRefund: NonNullable<OrderDetailsFragment["grantedRefunds"]>[number],
): boolean => {
  const linesWithQuantity = grantedRefund.lines?.filter(line => line.quantity > 0) ?? [];

  return linesWithQuantity.length === 0;
};

export const grantedRefundNeedsAttention = (status: OrderGrantedRefundStatusEnum): boolean =>
  status === OrderGrantedRefundStatusEnum.NONE || status === OrderGrantedRefundStatusEnum.FAILURE;

export const getOrderLevelGrantedRefundsNeedingAttention = (
  order: OrderDetailsFragment,
): OrderLevelGrantedRefund[] =>
  (order.grantedRefunds ?? [])
    .filter(isOrderLevelGrantedRefund)
    .filter(grantedRefund => grantedRefundNeedsAttention(grantedRefund.status))
    .map(grantedRefund => ({
      id: grantedRefund.id,
      status: grantedRefund.status,
      amount: grantedRefund.amount,
      shippingCostsIncluded: grantedRefund.shippingCostsIncluded,
      reason: grantedRefund.reason,
    }));
