import { OrderDetailsFragment, PaymentChargeStatusEnum } from "@dashboard/graphql";
import { IMoney } from "@dashboard/utils/intl";

import { extractOutstandingBalance } from "../OrderSummaryCard/utils";

export const extractRefundedAmount = (order: OrderDetailsFragment): IMoney => {
  if (order?.paymentStatus === PaymentChargeStatusEnum.FULLY_REFUNDED) {
    return order?.total?.gross;
  }
  if (order?.paymentStatus === PaymentChargeStatusEnum.PARTIALLY_REFUNDED) {
    return extractOutstandingBalance(order);
  }
  return (
    order?.total?.gross && {
      amount: 0,
      currency: order.total.gross.currency,
    }
  );
};
