import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "eHeybi",
    defaultMessage: "Order metadata in header",
    description: "ripple title",
  },
  contextual: {
    id: "+LT/SH",
    defaultMessage:
      "Order metadata is now edited from this button, which opens a dedicated dialog.",
    description: "ripple contextual hint",
  },
  global: {
    id: "EcucxA",
    defaultMessage:
      "Order metadata has moved from the order details page into a header button that opens a dedicated dialog. Public and private metadata are easier to find and edit.",
    description: "ripple description in What's New",
  },
});

export const rippleOrderMetadata: Ripple = {
  type: "improvement",
  ID: "order-metadata",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 4, 31),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
