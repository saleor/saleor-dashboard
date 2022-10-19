import { defineMessages } from "react-intl";

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
