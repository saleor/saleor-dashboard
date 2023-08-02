import Skeleton from "@dashboard/components/Skeleton";
import React from "react";
import { IntlShape } from "react-intl";

import { homeNotificationTableMessages as messages } from "./messages";

export const getOrderToFulfillText = (
  ordersToFulfill: number | undefined,
  intl: IntlShape,
) => {
  if (ordersToFulfill === undefined) {
    return <Skeleton />;
  }

  if (ordersToFulfill === 0) {
    return intl.formatMessage(messages.noOrders);
  }

  return intl.formatMessage(messages.orderReady, {
    amount: <strong>{ordersToFulfill}</strong>,
  });
};

export const getOrdersToCaptureText = (
  ordersToCapture: number | undefined,
  intl: IntlShape,
) => {
  if (ordersToCapture === undefined) {
    return <Skeleton />;
  }

  if (ordersToCapture === 0) {
    return intl.formatMessage(messages.noPaymentWaiting);
  }

  return intl.formatMessage(messages.paymentCapture, {
    amount: <strong>{ordersToCapture}</strong>,
  });
};

export const getProductsOutOfStockText = (
  productsOutOfStock: number | undefined,
  intl: IntlShape,
) => {
  if (productsOutOfStock === undefined) {
    return <Skeleton />;
  }

  if (productsOutOfStock === 0) {
    return intl.formatMessage(messages.noProductsOut);
  }

  return intl.formatMessage(messages.productOut, {
    amount: <strong>{productsOutOfStock}</strong>,
  });
};
