import { IMoney, subtractMoney } from "@saleor/components/Money";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import { PaymentChargeStatusEnum } from "@saleor/types/globalTypes";

export const extractOutstandingBalance = (order: OrderDetails_order): IMoney =>
  order?.totalCaptured &&
  order?.total?.gross &&
  subtractMoney(order.total.gross, order.totalCaptured);

export const extractRefundedAmount = (order: OrderDetails_order): IMoney => {
  if (order?.paymentStatus === PaymentChargeStatusEnum.FULLY_REFUNDED) {
    return order?.total?.gross;
  }
  if (order?.paymentStatus === PaymentChargeStatusEnum.PARTIALLY_REFUNDED) {
    return extractOutstandingBalance(order);
  }
  return (
    order?.total?.gross && {
      amount: 0,
      currency: order.total.gross.currency
    }
  );
};
