import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "qe0m3M",
    defaultMessage: "Order Channel in Header",
    description: "ripple title",
  },
  contextual: {
    id: "OyAcKD",
    defaultMessage:
      "Sales channel now appears in the order header. Click it to view other orders from the same channel.",
    description: "ripple contextual hint",
  },
  global: {
    id: "737Tk9",
    defaultMessage:
      "Sales channel is now shown directly in the order header, next to the order date and status. Click the channel to open the orders list filtered to the same channel, instead of jumping to channel settings.",
    description: "ripple description in What's New",
  },
});

export const rippleOrderChannelInHeader: Ripple = {
  type: "improvement",
  ID: "order-channel-in-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
  dateAdded: new Date(2026, 4, 26),
};
