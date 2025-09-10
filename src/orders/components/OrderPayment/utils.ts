import { subtractMoney } from "@dashboard/components/Money";
import { OrderDetailsFragment, PaymentChargeStatusEnum } from "@dashboard/graphql";
import { IMoney } from "@dashboard/utils/intl";

export const extractOutstandingBalance = (order: OrderDetailsFragment): IMoney =>
  order?.totalCaptured &&
  order?.total?.gross &&
  subtractMoney(order.total.gross, order.totalCaptured);

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

// Discount should be shown as negative number to give user
// clear information that this amount will be subtracted from total amount
export const getDiscountAmount = (amount: IMoney) => {
  if (amount.amount <= 0) {
    return amount;
  }

  return {
    ...amount,
    amount: amount.amount * -1,
  };
};
