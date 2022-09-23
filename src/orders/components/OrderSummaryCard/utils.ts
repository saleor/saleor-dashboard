import { subtractMoney } from "@saleor/components/Money";
import { GiftCardEventsEnum, OrderDetailsFragment } from "@saleor/graphql";
import { IMoney } from "@saleor/utils/intl";
import compact from "lodash/compact";

// TODO: This should be removed once gift cards are not treated as discounts
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
        ({ orderId, type }) =>
          type === GiftCardEventsEnum.USED_IN_ORDER && orderId === id,
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

export const extractOutstandingBalance = (
  order: OrderDetailsFragment,
): IMoney =>
  order?.totalCaptured &&
  order?.total?.gross &&
  subtractMoney(order.total.gross, order.totalCaptured);
