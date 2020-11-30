import { IMoney, subtractMoney } from "@saleor/components/Money";
import { FormsetData } from "@saleor/hooks/useFormset";

import {
  OrderRefundData_order,
  OrderRefundData_order_fulfillments,
  OrderRefundData_order_lines
} from "../types/OrderRefundData";

export type OrderWithTotalAndTotalCaptured = Pick<
  OrderRefundData_order,
  "total" | "totalCaptured"
>;

export function getPreviouslyRefundedPrice(
  order: OrderWithTotalAndTotalCaptured
): IMoney {
  return (
    order?.totalCaptured &&
    order?.total?.gross &&
    subtractMoney(order?.totalCaptured, order?.total?.gross)
  );
}

export function getRefundedLinesPriceSum(
  lines: OrderRefundData_order_lines[],
  refundedProductQuantities: FormsetData<null, string>
): number {
  return lines?.reduce((sum, line) => {
    const refundedLine = refundedProductQuantities.find(
      refundedLine => refundedLine.id === line.id
    );
    return sum + line.unitPrice.gross.amount * Number(refundedLine?.value || 0);
  }, 0);
}

export function getAllFulfillmentLinesPriceSum(
  fulfillments: OrderRefundData_order_fulfillments[],
  refundedFulfilledProductQuantities: FormsetData<null, string>
): number {
  return fulfillments?.reduce((sum, fulfillment) => {
    const fulfilmentLinesSum = fulfillment?.lines.reduce((sum, line) => {
      const refundedLine = refundedFulfilledProductQuantities.find(
        refundedLine => refundedLine.id === line.id
      );
      return (
        sum +
        line.orderLine.unitPrice.gross.amount * Number(refundedLine?.value || 0)
      );
    }, 0);
    return sum + fulfilmentLinesSum;
  }, 0);
}
