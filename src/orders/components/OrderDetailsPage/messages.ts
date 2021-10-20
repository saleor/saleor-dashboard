import { defineMessages } from "react-intl";

export const orderDetailsPageMessages = defineMessages({
  cancelOrder: {
    defaultMessage: "Cancel order",
    description: "cancel button"
  },
  confirmOrder: {
    defaultMessage: "Confirm order",
    description: "save button"
  },
  returnOrder: {
    defaultMessage: "Return / Replace order",
    description: "return button"
  },
  orderOverpaid: {
    defaultMessage: "Order is overpaid",
    description: "order payment"
  },
  orderOverpaidDescription: {
    defaultMessage:
      "Authorized/Captured payment total is higher than the value of the order.",
    description: "order payment"
  }
});
