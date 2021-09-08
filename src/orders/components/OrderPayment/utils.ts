import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import { GiftCardEventsEnum } from "@saleor/types/globalTypes";
import compact from "lodash/compact";

export const extractOrderGiftCardUsedAmount = (
  order?: OrderDetails_order
): number | undefined => {
  if (!order) {
    return undefined;
  }

  const { id, giftCards } = order;

  const usedInOrderEvents = compact(
    giftCards.map(({ events }) =>
      events.find(
        ({ orderId, type }) =>
          type === GiftCardEventsEnum.USED_IN_ORDER && orderId === id
      )
    )
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
