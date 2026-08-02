import { defineMessages } from "react-intl";

export const messages = defineMessages({
  activateTitle: {
    id: "vo4bI1",
    defaultMessage: "Activate channel",
    description: "channel activate confirmation dialog title",
  },
  activateDescription: {
    id: "8u1Ks9",
    defaultMessage:
      "Are you sure you want to activate {name}? Products and content for this channel will become available to customers.",
    description: "channel activate confirmation dialog body",
  },
  deactivateTitle: {
    id: "15w4sp",
    defaultMessage: "Deactivate channel",
    description: "channel deactivate confirmation dialog title",
  },
  deactivateDescription: {
    id: "h0OD30",
    defaultMessage:
      "Are you sure you want to deactivate {name}? Customers will no longer be able to buy through this channel until you activate it again.",
    description: "channel deactivate confirmation dialog body",
  },
});
