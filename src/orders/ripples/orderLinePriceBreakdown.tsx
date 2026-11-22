import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "kiEm0B",
    defaultMessage: "See how a line price was calculated",
    description: "ripple title",
  },
  contextual: {
    id: "CR6TC/",
    defaultMessage: "Click a discounted unit price or line total to open a step-by-step breakdown.",
    description: "ripple contextual hint",
  },
  global: {
    id: "70tAPC",
    defaultMessage:
      "On confirmed orders, click a discounted unit price or line total to see a read-only breakdown of how it was calculated — promotions, vouchers, and manual or order-wide discounts.",
    description: "ripple description in What's New",
  },
});

export const rippleOrderLinePriceBreakdown: Ripple = {
  type: "feature",
  ID: "order-line-price-breakdown",
  TTL_seconds: 60 * 60 * 24 * 14,
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
  dateAdded: new Date(2026, 4, 11),
};
