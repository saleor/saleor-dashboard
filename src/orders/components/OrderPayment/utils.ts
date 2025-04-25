// @ts-strict-ignore
import { subtractMoney } from "@dashboard/components/Money";
import {
  GiftCardEventsEnum,
  OrderDetailsFragment,
  PaymentChargeStatusEnum,
} from "@dashboard/graphql";
import { IMoney } from "@dashboard/utils/intl";
import compact from "lodash/compact";

export const obtainUsedGifrcards = (order?: OrderDetailsFragment) => {
  if (!order) return null;

  const { giftCards } = order;

  if (giftCards.length > 0) {
    return giftCards;
  }

  return null;
};

export const extractOrderGiftCardUsedAmount = (
  order?: OrderDetailsFragment,
): number | undefined => {
  if (!order) {
    return undefined;
  }

  const { id, giftCards } = order;
  const usedInOrderEvents = compact(
    giftCards.map(({ events }) =>
      events.find(
        ({ orderId, type }) => type === GiftCardEventsEnum.USED_IN_ORDER && orderId === id,
      ),
    ),
  );

  if (!usedInOrderEvents.length) {
    return undefined;
  }

  return usedInOrderEvents.reduce((resultAmount, { balance }) => {
    const { currentBalance, oldCurrentBalance } = balance;
    const amountToAdd = oldCurrentBalance.amount - currentBalance.amount;

    return resultAmount + amountToAdd;
  }, 0);
};

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
