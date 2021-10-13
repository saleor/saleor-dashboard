import { defineMessages } from "react-intl";

export const messages = defineMessages({
  reservedStock: {
    defaultMessage: "Reserved stock",
    description: "title"
  },
  reservedStockDescription: {
    defaultMessage:
      "Set up time amount that stock in checkout is reserved for the customer. You can set separate values for authenticated and anonymous customers.",
    description: "description"
  },
  stockReservationForAuthenticatedUser: {
    defaultMessage: "Stock reservation for authenticated user (in minutes)",
    description: "input label"
  },
  stockReservationForAnonymousUser: {
    defaultMessage: "Stock reservation for anonymous user (in minutes)",
    description: "input label"
  },
  stockWillNotBeReserved: {
    defaultMessage:
      "Leaving this setting empty will mean that stock won’t be reserved",
    description: "input helper text"
  }
});
