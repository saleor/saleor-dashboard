import { defineMessages } from "react-intl";

export const alertMessages = defineMessages({
  manyAlerts: {
    id: "43AOvZ",
    defaultMessage: "You will not be able to finalize this draft because:",
    description: "alert group message",
  },
  inactiveChannel: {
    id: "SPp3cx",
    defaultMessage: "Orders cannot be placed in an inactive channel.",
    description: "alert message",
  },
  noProductsInChannel: {
    id: "O4QNFx",
    defaultMessage: "There are no available products in this channel.",
    description: "alert message",
  },
  noShippingMethodsInChannel: {
    id: "BvRyoX",
    defaultMessage: "There are no available shipping methods in this channel.",
    description: "alert message",
  },
});
