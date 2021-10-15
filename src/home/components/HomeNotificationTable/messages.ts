import { defineMessages } from "react-intl";

export const HomeNotificationTableMessages = defineMessages({
  createNewChannel: {
    defaultMessage: "Create new channel"
  },
  noOrders: {
    defaultMessage: "No orders ready to fulfill",
    id: "homeNotificationTableNoOrders"
  },
  noPaymentWaiting: {
    defaultMessage: "No payments waiting for capture",
    id: "homeNotificationsNoPayments"
  },
  noProductsOut: {
    defaultMessage: "No products are out of stock",
    id: "homeNotificationsTableNoProducts"
  },
  orderReady: {
    defaultMessage:
      "{amount, plural,one {One order is ready to fulfill} other {{amount} orders are ready to fulfill}}",
    id: "homeNotificationTableOrders"
  },
  paymentCapture: {
    defaultMessage:
      "{amount, plural,one {One payment to capture}other {{amount} payments to capture}}",
    id: "homeNotificationTablePayments"
  },
  productOut: {
    defaultMessage:
      "{amount, plural,one {One product out of stock}other {{amount} products out of stock}}",
    id: "homeNotificationTableProducts"
  }
});
