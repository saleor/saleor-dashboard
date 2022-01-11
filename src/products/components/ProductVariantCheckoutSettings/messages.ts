import { defineMessages } from "react-intl";

export const messages = defineMessages({
  checkoutLimits: {
    defaultMessage: "Checkout limits",
    description: "title"
  },
  checkoutLineLimit: {
    defaultMessage: "Limit quantity per checkout (optional)",
    description: "input label"
  },
  checkoutLimitsDescription: {
    defaultMessage:
      "Your customer won't be allowed to buy bigger quantity per checkout than shown here.",
    description: "input helper text"
  }
});
