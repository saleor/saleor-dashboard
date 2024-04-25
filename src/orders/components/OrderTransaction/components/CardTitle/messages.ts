import { defineMessages } from "react-intl";

export const messages = defineMessages({
  cancelPending: {
    defaultMessage: "Pending cancel",
    id: "YUaalK",
    description: "Cancel in progress transaction amount, data display header",
  },
  canceled: {
    defaultMessage: "Canceled",
    id: "phIGQ1",
    description: "Canceled transaction amount, data display header",
  },
  refundPending: {
    defaultMessage: "Pending refund",
    id: "nSMe3f",
    description: "Refund in progress transaction amount, data display header",
  },
  refunded: {
    defaultMessage: "Refunded",
    id: "gNm1li",
    description: "Refunded transaction amount, data display header",
  },
  chargePending: {
    defaultMessage: "Pending charge",
    id: "4fJ17F",
    description: "Charge in progress transaction amount, data display header",
  },
  charged: {
    defaultMessage: "Charged",
    id: "LY5dS9",
    description: "Charged transaction amount, data display header",
  },
  authorizePending: {
    defaultMessage: "Pending auth",
    id: "9WhNiN",
    description: "Pending authorization transaction amount, data display header",
  },
  authorized: {
    defaultMessage: "Authorized",
    id: "7ejEbB",
    description:
      "Authorized (amount locked on card, not transfered to store owner) transaction amount, data display header",
  },
});
