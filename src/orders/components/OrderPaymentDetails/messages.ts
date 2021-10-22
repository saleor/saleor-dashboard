import { defineMessages } from "react-intl";

export const orderPaymentDetailsMessages = defineMessages({
  gatewayPayment: {
    defaultMessage: "{gatewayName} Payment",
    description: "payment header with gateway name"
  },
  pspReference: {
    defaultMessage: "PSP reference:",
    description: "order payment"
  },
  preauthorizedAmount: {
    defaultMessage: "Preauthorized amount",
    description: "order payment"
  },
  capturedAmount: {
    defaultMessage: "Captured amount",
    description: "order payment"
  },
  voidPayment: {
    defaultMessage: "Void",
    description: "void payment, button"
  },
  capturePayment: {
    defaultMessage: "Capture",
    description: "capture payment, button"
  }
});
