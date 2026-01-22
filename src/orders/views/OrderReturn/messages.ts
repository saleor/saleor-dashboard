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
    id: "j+pYrh",
    defaultMessage: "Products returned",
    description: "order returned success message",
  },
  successAlertWithGrant: {
    id: "NPT+At",
    defaultMessage: "Products returned, refund granted",
    description: "order returned success message",
  },
  successAlertWithSend: {
    id: "G+UQmN",
    defaultMessage: "Products returned, refund sent",
    description: "order returned success message",
  },
});
