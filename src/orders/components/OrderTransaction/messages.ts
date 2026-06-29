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
  captureInProgress: {
    defaultMessage: "Capture in progress",
    description: "Transaction capture button label while a capture request is in flight",
    id: "UjzI96",
  },
  cancelInProgress: {
    defaultMessage: "Cancel in progress",
    description: "Transaction cancel action label while a cancel request is in flight",
    id: "P94gV7",
  },
  markAsPaid: {
    defaultMessage: "Mark as Paid",
    description: "Button to manually mark order as paid without actual payment",
    id: "SDgGcU",
  },
});
