import { OrderDetailsFragment } from "@dashboard/graphql";

type OrderLineWithTotalRefunded = OrderDetailsFragment["lines"][number] & {
  totalQtyRefunded: number;
};

export const calculateOrderLineRefundTotals = (
  order: OrderDetailsFragment,
): OrderLineWithTotalRefunded[] => {
  return order?.lines.reduce<OrderLineWithTotalRefunded[]>((acc, line) => {
    const lineId = line.id;
    const lineWithTotalRefunded = { ...line, totalQtyRefunded: 0 };

    order?.grantedRefunds.forEach(refund => {
      const refundLines = refund.lines ?? [];
      const refundLine = refundLines.find(refundLine => refundLine.orderLine.id === lineId);

      if (!refundLine) {
        return;
      }

      lineWithTotalRefunded.totalQtyRefunded += refundLine.quantity;
    });
    acc.push(lineWithTotalRefunded);

    return acc;
  }, []);
};

export const isEveryLineFullyRefunded = (lines: OrderLineWithTotalRefunded[]) =>
  lines?.every(line => line.quantity === line.totalQtyRefunded);
