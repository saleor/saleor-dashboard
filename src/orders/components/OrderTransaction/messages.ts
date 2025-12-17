import { defineMessages } from "react-intl";

export const transactionActionMessages = defineMessages({
  capture: {
    defaultMessage: "Capture",
    description: "Transaction capture button - charge preauthorized transaction amount",
    id: "43QkTW",
  },
  void: {
    defaultMessage: "Void",
    description: "Transaction void button - return preauthorized amount to client",
    id: "XPiJex",
  },
  cancel: {
    defaultMessage: "Cancel",
    id: "iIfq2+",
    description: "Transaction cancel button - return preauthorized amount to client",
  },
  refund: {
    defaultMessage: "Refund",
    description: "Transaction refund button - return captured amount to client",
    id: "8HmEqK",
  },
  markAsPaid: {
    defaultMessage: "Mark as Paid",
    description: "Button to manually mark order as paid without actual payment",
    id: "SDgGcU",
  },
});
