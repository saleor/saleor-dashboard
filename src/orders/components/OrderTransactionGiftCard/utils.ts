// @ts-strict-ignore
import { GiftCardEventsEnum, OrderGiftCardFragment } from "@dashboard/graphql";

export const getUsedInGiftCardEvents = (giftCard: OrderGiftCardFragment, orderId: string) => {
  if (!giftCard.events || !orderId) {
    return [];
  }

  return giftCard.events.filter(
    ({ orderId: eventOrderId, type }) =>
      type === GiftCardEventsEnum.USED_IN_ORDER && eventOrderId === orderId,
  );
};

export const getGiftCardAmount = (usedInOrderEvents: OrderGiftCardFragment["events"]) =>
  usedInOrderEvents.reduce((resultAmount, { balance }) => {
    const { currentBalance, oldCurrentBalance } = balance;
    const amountToAdd = oldCurrentBalance.amount - currentBalance.amount;

    return resultAmount + amountToAdd;
  }, 0);
