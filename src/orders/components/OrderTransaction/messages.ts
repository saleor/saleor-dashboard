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
  refund: {
    defaultMessage: "Refund",
    description: "Transaction refund button - return captured amount to client",
    id: "8HmEqK",
  },
  captureInProgress: {
    defaultMessage: "Capture in progress",
    description: "Transaction capture button label while a capture request is in flight",
    id: "UjzI96",
  },
  voidInProgress: {
    defaultMessage: "Void in progress",
    description: "Transaction void action label while a void request is in flight",
    id: "COhmwv",
  },
  markAsPaid: {
    defaultMessage: "Mark as Paid",
    description: "Button to manually mark order as paid without actual payment",
    id: "SDgGcU",
  },
});
