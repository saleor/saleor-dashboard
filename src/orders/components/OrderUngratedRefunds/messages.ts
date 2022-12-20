import { defineMessages } from "react-intl";

export const orderUngratedRefundMessages = defineMessages({
  boxText: {
    defaultMessage:
      "The money was returned by one of the payment gateways without being refunded to the customer. Do you want to grant a refund?",
    id: "r0K+bD",
    description:
      "box text, displayed when a refund was issued by payment gateway but wasn't granted in Saleor",
  },
});
