import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "VWM4RE",
    defaultMessage: "Promotion metadata",
    description: "ripple title",
  },
  contextual: {
    id: "spmYoM",
    defaultMessage: "View and edit the promotion's public and private metadata from this button.",
    description: "ripple contextual hint",
  },
  global: {
    id: "ibhjFh",
    defaultMessage:
      "Promotion pages now have a header button that opens the promotion's metadata, so public and private promotion metadata can be viewed and edited in the dashboard, like on vouchers.",
    description: "ripple description in What's New",
  },
});

export const ripplePromotionMetadata: Ripple = {
  type: "feature",
  ID: "promotion-metadata-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 10, 14),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
