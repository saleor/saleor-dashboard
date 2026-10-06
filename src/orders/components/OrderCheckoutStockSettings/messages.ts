import { defineMessages } from "react-intl";

export const messages = defineMessages({
  reservedStock: {
    id: "X7fqfM",
    defaultMessage: "Reserved stock",
    description: "title",
  },
  checkoutLimits: {
    id: "8uo4v1",
    defaultMessage: "Checkout limits",
    description: "title",
  },
  reservedStockDescription: {
    id: "C4aDMy",
    defaultMessage:
      "Set up time amount that stock in checkout is reserved for the customer. You can set separate values for authenticated and anonymous customers.",
    description: "description",
  },
  stockReservationForAuthenticatedUser: {
    id: "OaKyz4",
    defaultMessage: "Stock reservation for authenticated user (in minutes)",
    description: "input label",
  },
  stockReservationForAnonymousUser: {
    id: "+T0oJ7",
    defaultMessage: "Stock reservation for anonymous user (in minutes)",
    description: "input label",
  },
  checkoutLineLimit: {
    id: "QclvqG",
    defaultMessage: "Checkout line limit",
    description: "input label",
  },
  enableStockReservationForAuthenticatedUser: {
    id: "MhtjvQ",
    defaultMessage: "Enable checkout stock reservation for authenticated users",
    description: "checkbox label",
  },
  enableStockReservationForAnonymousUser: {
    id: "lybc+B",
    defaultMessage: "Enable checkout stock reservation for anonymous users",
    description: "checkbox label",
  },
  checkoutLimitsDescription: {
    id: "+do3gl",
    defaultMessage:
      "This number defines quantity of items in checkout line that can be bought. You can override this setting per variant. Leaving this setting empty mean that there is no limits.",
    description: "input helper text",
  },
});
