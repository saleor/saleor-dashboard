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
