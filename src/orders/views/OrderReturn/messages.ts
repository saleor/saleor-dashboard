import { defineMessages } from "react-intl";

export const messages = defineMessages({
  cannotRefundDescription: {
    id: "XQBVEJ",
    defaultMessage:
      "We’ve encountered a problem while refunding the products. Product’s were not refunded. Please try again.",
    description: "order return error description when cannot refund",
  },
  cannotRefundTitle: {
    id: "l9Lwjh",
    defaultMessage: "Couldn't refund products",
    description: "order return error title when cannot refund",
  },
  successAlert: {
    id: "/z9uo1",
    defaultMessage: "Successfully returned products!",
    description: "order returned success message",
  },
  successAlertWithGrant: {
    id: "laax5C",
    defaultMessage: "Successfully returned products and granted refund!",
    description: "order returned success message",
  },
  successAlertWithSend: {
    id: "/5csTX",
    defaultMessage: "Successfully returned products and sent refund!",
    description: "order returned success message",
  },
});
