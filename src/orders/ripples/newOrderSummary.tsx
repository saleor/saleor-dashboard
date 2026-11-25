import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "XFqbHD",
    defaultMessage: "Refreshed Order Sections",
    description: "ripple title",
  },
  contextual: {
    id: "BMSZ5p",
    defaultMessage: "We have refreshed Order Summary, Transactions and History sections.",
    description: "ripple contextual hint",
  },
  global: {
    id: "BjCfCS",
    defaultMessage:
      "We redesigned the Order page look - welcome the refreshed Order Summary, Transactions, and History sections with improved data visualization and faster loading times.",
    description: "ripple description in What's New",
  },
});

export const rippleRefreshedOrderSections: Ripple = {
  type: "improvement",
  ID: "refreshed-order-sections",
  TTL_seconds: 60 * 60 * 24 * 3, // 3 days
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
  dateAdded: new Date(2025, 11, 17),
};
