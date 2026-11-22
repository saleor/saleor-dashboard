import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "I8rcLc",
    defaultMessage: "Bulk Variant Generator",
    description: "ripple title",
  },
  contextual: {
    id: "pMhexk",
    defaultMessage:
      "Quickly create all product variant combinations by selecting attribute values.",
    description: "ripple contextual hint",
  },
  global: {
    id: "tAEbUE",
    defaultMessage:
      "Quickly create all product variant combinations by selecting attribute values, with live preview, optional SKU/stock defaults, and automatic skipping of existing variants.",
    description: "ripple description in What's New",
  },
});

export const rippleVariantGenerator: Ripple = {
  type: "feature",
  ID: "bulk-variant-generator",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
  dateAdded: new Date(2026, 0, 28),
};
