import { defineMessages } from "react-intl";

export const orderPaymentMessages = defineMessages({
  paymentTitle: {
    id: "H52OCA",
    defaultMessage: "Payment",
    description: "Order summary payment header",
  },
  refundsTitle: {
    id: "E9Dz18",
    defaultMessage: "Refunds",
    description: "Order summary refunds header",
  },
  authorized: {
    id: "IyV8CY",
    defaultMessage: "Authorized",
    description: "all authorized amount from transactions in order",
  },
  captured: {
    id: "egBBQ/",
    defaultMessage: "Captured",
    description: "all captured amount from transactions in order",
  },
  refunded: {
    id: "6Joy8j",
    defaultMessage: "Refunded",
    description: "sum of all refunds from transactions in order",
  },
  refundsExplanation: {
    id: "16sza6",
    defaultMessage:
      "Refund grants reserve a money which later can be sent to customers via original payment methods or a manual transaction.",
  },
});

export const orderPaymentActionButtonMessages = defineMessages({
  grantRefund: {
    defaultMessage: "Grant refund",
    id: "kWw0fr",
  },
  sendRefund: {
    defaultMessage: "Send refund",
    id: "2WenNh",
  },
});
