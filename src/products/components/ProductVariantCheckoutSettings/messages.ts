import { defineMessages } from "react-intl";

export const messages = defineMessages({
  checkoutLimits: {
    id: "8uo4v1",
    defaultMessage: "Checkout limits",
    description: "title",
  },
  checkoutLineLimit: {
    id: "C7I2lg",
    defaultMessage: "Limit quantity per checkout (optional)",
    description: "input label",
  },
  checkoutLimitsDescription: {
    id: "MwfSVA",
    defaultMessage:
      "Customers can not add quantities to a single cart above the limit when value is provided.",
    description: "input helper text",
  },
});
