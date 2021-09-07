import {
  OrderDetails_order,
  OrderDetails_order_giftCards_events
} from "@saleor/orders/types/OrderDetails";
import { GiftCardEventsEnum } from "@saleor/types/globalTypes";

export const extractOrderGiftCardUsedAmount = (
  order?: OrderDetails_order
): number | undefined => {
  if (!order) {
    return undefined;
  }

  const { id, giftCards } = order;

  const orderRelatedEvent = giftCards.reduce((resultEvent, { events }) => {
    if (resultEvent) {
      return resultEvent;
    }

    return events.find(
      ({ orderId, type }) =>
        type === GiftCardEventsEnum.USED_IN_ORDER && orderId === id
    );
  }, undefined as OrderDetails_order_giftCards_events);

  if (!orderRelatedEvent) {
    return undefined;
  }

  const { currentBalance, oldCurrentBalance } = orderRelatedEvent.balance;

  return oldCurrentBalance.amount - currentBalance.amount;
};
