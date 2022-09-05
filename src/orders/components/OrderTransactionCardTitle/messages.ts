import { defineMessages } from "react-intl";

export const messages = defineMessages({
  refunded: {
    defaultMessage: "Refunded",
    id: "gNm1li",
    description: "Refunded transaction amount, data display header",
  },
  charged: {
    defaultMessage: "Charged",
    id: "LY5dS9",
    description: "Charged transaction amount, data display header",
  },
  authorized: {
    defaultMessage: "Authorized",
    id: "7ejEbB",
    description:
      "Authorized (amount locked on card, not transfered to store owner) transaction amount, data display header",
  },
});

export const transactionActionMessages = defineMessages({
  capture: {
    defaultMessage: "Capture",
    description:
      "Transaction capture button - charge preauthorized transaction amount",
    id: "43QkTW",
  },
  void: {
    defaultMessage: "Void",
    description:
      "Transaction void button - return preauthorized amount to client",
    id: "XPiJex",
  },
});
