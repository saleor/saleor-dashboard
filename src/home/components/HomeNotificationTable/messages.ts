import { defineMessages } from "react-intl";

export const homeNotificationTableMessages = defineMessages({
  createNewChannel: {
    defaultMessage: "Create new channel"
  },
  noOrders: {
    defaultMessage: "No orders ready to fulfill"
  },
  noPaymentWaiting: {
    defaultMessage: "No payments waiting for capture"
  },
  noProductsOut: {
    defaultMessage: "No products are out of stock"
  },
  orderReady: {
    defaultMessage:
      "{amount, plural,one {One order is ready to fulfill} other {{amount} orders are ready to fulfill}}"
  },
  paymentCapture: {
    defaultMessage:
      "{amount, plural,one {One payment to capture}other {{amount} payments to capture}}"
  },
  productOut: {
    defaultMessage:
      "{amount, plural,one {One product out of stock}other {{amount} products out of stock}}"
  }
});
