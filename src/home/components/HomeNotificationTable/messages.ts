import { defineMessages } from "react-intl";

export const homeNotificationTableMessages = defineMessages({
  createNewChannel: {
    id: "Nuq83+",
    defaultMessage: "Create new channel",
  },
  noOrders: {
    id: "E9Jssl",
    defaultMessage: "No orders ready to fulfill",
  },
  noPaymentWaiting: {
    id: "5dyOs0",
    defaultMessage: "No payments waiting for capture",
  },
  noProductsOut: {
    id: "bFhzRX",
    defaultMessage: "No products are out of stock",
  },
  orderReady: {
    id: "c0H45L",
    defaultMessage:
      "{amount, plural,one {One order is ready to fulfill} other {{amount} orders are ready to fulfill}}",
  },
  paymentCapture: {
    id: "md326v",
    defaultMessage:
      "{amount, plural,one {One payment to capture}other {{amount} payments to capture}}",
  },
  productOut: {
    id: "cdxwA8",
    defaultMessage:
      "{amount, plural,one {One product out of stock}other {{amount} products out of stock}}",
  },
});
