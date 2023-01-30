import { PaymentChargeStatusEnum } from "@dashboard/graphql";
import { OrderBothTypes, OrderSharedType } from "@dashboard/orders/types";
import { IMoney } from "@dashboard/utils/intl";

import { extractOutstandingBalance } from "../OrderSummaryCard/utils";

export const extractRefundedAmount = (order: OrderSharedType): IMoney => {
  if (order?.paymentStatus === PaymentChargeStatusEnum.FULLY_REFUNDED) {
    return order?.total?.gross;
  }
  if (order?.paymentStatus === PaymentChargeStatusEnum.PARTIALLY_REFUNDED) {
    return extractOutstandingBalance(order as OrderBothTypes);
  }
  return (
    order?.total?.gross && {
      amount: 0,
      currency: order.total.gross.currency,
    }
  );
};
