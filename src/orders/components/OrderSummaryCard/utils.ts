// @ts-strict-ignore
import { subtractMoney } from "@dashboard/components/Money";
import { GiftCardEventsEnum, OrderDetailsFragment } from "@dashboard/graphql";
import { getOrderCharged } from "@dashboard/orders/utils/data";
import { IMoney } from "@dashboard/utils/intl";
import compact from "lodash/compact";
import { IntlShape } from "react-intl";

import { orderSummaryMessages } from "./messages";

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
  getOrderCharged(order) &&
  order?.total?.gross &&
  subtractMoney(order.total.gross, getOrderCharged(order));

export const getDeliveryMethodName = (
  order: OrderDetailsFragment,
  intl: IntlShape,
) => {
  if (
    order?.shippingMethodName === undefined &&
    order?.shippingPrice === undefined &&
    order?.collectionPointName === undefined
  ) {
    return null;
  }

  if (order.shippingMethodName === null) {
    return order.collectionPointName == null
      ? intl.formatMessage(orderSummaryMessages.shippingDoesNotApply)
      : intl.formatMessage(orderSummaryMessages.clickAndCollectShippingMethod);
  }

  return order.shippingMethodName;
};

export const getTaxTypeText = (
  order: OrderDetailsFragment,
  intl: IntlShape,
) => {
  if (order?.total?.tax === undefined) {
    return "";
  }
  if (order.total.tax.amount > 0) {
    return intl.formatMessage(orderSummaryMessages.vatIncluded);
  }
  return intl.formatMessage(orderSummaryMessages.vatNotIncluded);
};
