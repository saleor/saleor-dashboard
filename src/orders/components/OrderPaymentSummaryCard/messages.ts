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
  cancelled: {
    defaultMessage: "Cancelled",
    id: "lrdAIY",
    description: "amount of all cancelled transactions in order",
  },
  pending: {
    defaultMessage: "Pending",
    id: "flnL3R",
    description: "sum of pending amount (any status) in order's transactions",
  },
  grantedRefund: {
    defaultMessage: "Granted",
    id: "NPIBGp",
    description:
      "heading, sum of all granted refunds from transactions in order",
  },
  pendingRefund: {
    defaultMessage: "Pending",
    id: "IfiR4M",
    description:
      "heading, sum of all pending refunds from transactions in order",
  },
  refunded: {
    id: "hoii+4",
    defaultMessage: "Refunded",
    description:
      "heading, sum of all completed refunds from transactions in order",
  },
  refundsExplanation: {
    id: "16sza6",
    defaultMessage:
      "Refund grants reserve a money which later can be sent to customers via original payment methods or a manual transaction.",
  },
  noPayments: {
    defaultMessage: "This order has no payment yet.",
    id: "T34dJq",
    description: "Displayed when order has no payment",
  },
  includedInSubtotal: {
    id: "pPef6L",
    defaultMessage: "Included in subtotal",
    description: "order payment",
  },
  includedInPrices: {
    id: "ukYopn",
    defaultMessage: "Included in prices",
    description: "order payment",
  },
  settled: {
    id: "Sxzua5",
    defaultMessage: "Settled",
    description: "order payment",
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
  markAsPaid: {
    defaultMessage: "Mark as paid",
    id: "01+5kQ",
  },
});
