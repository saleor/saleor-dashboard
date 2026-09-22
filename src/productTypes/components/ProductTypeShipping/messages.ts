import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "/2OOMe",
    defaultMessage: "Shipping",
    description: "product type shipping settings, section header",
  },
  requiresShipping: {
    id: "atsEZ1",
    defaultMessage: "Requires shipping",
    description: "product type shipping toggle title",
  },
  requiresShippingDescription: {
    id: "T+b/LD",
    defaultMessage:
      "Turn on for physical products. Digital goods and most gift cards can stay off.",
    description: "product type shipping toggle description",
  },
  weight: {
    id: "zCb8fX",
    defaultMessage: "Weight",
  },
  weightHelper: {
    id: "Gu+UdH",
    defaultMessage: "Default when a product of this type doesn’t set its own weight.",
    description: "product type default weight helper",
  },
});
