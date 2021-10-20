import { defineMessages } from "react-intl";

export const orderPaymentToolbarMessages = defineMessages({
  refund: {
    defaultMessage: "Refund",
    description: "button"
  },
  void: {
    defaultMessage: "Void",
    description: "void payment, button"
  },
  capture: {
    defaultMessage: "Capture",
    description: "capture payment, button"
  },
  markAsPaid: {
    defaultMessage: "Mark as paid",
    description: "order, button"
  }
});
