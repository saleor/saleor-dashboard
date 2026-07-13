import { type OrderDetailsFragment } from "@dashboard/graphql";

type GrantedRefund = NonNullable<OrderDetailsFragment["grantedRefunds"]>[number];

export const getGrantedRefundLineAmount = ({
  grantedRefund,
  orderLineId,
  grantedLineQuantity,
  orderLines,
}: {
  grantedRefund: GrantedRefund;
  orderLineId: string;
  grantedLineQuantity: number;
  orderLines: OrderDetailsFragment["lines"];
}): { amount: number; currency: string } => {
  const currency = grantedRefund.amount.currency;
  const refundLines = grantedRefund.lines?.filter(line => line.quantity > 0) ?? [];

  if (refundLines.length === 0) {
    return { amount: grantedRefund.amount.amount, currency };
  }

  if (refundLines.length === 1 && refundLines[0].orderLine?.id === orderLineId) {
    return { amount: grantedRefund.amount.amount, currency };
  }

  const getLineValue = (lineId: string | undefined, quantity: number): number => {
    const orderLine = orderLines?.find(line => line.id === lineId);

    return (orderLine?.unitPrice.gross.amount ?? 0) * quantity;
  };

  const totalValue = refundLines.reduce(
    (sum, line) => sum + getLineValue(line.orderLine?.id, line.quantity),
    0,
  );
  const lineValue = getLineValue(orderLineId, grantedLineQuantity);

  if (totalValue <= 0 || lineValue <= 0) {
    return { amount: grantedRefund.amount.amount, currency };
  }

  const proportionalAmount = (lineValue / totalValue) * grantedRefund.amount.amount;

  return {
    amount: Math.round(proportionalAmount * 100) / 100,
    currency,
  };
};
