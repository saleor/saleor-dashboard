import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "i9HwYx",
    defaultMessage: "Draft order metadata in header",
    description: "ripple title",
  },
  contextual: {
    id: "34D5al",
    defaultMessage:
      "Draft order metadata is now edited from this button, which opens a dedicated dialog.",
    description: "ripple contextual hint",
  },
  global: {
    id: "tGCQQC",
    defaultMessage:
      "Draft order metadata is now available from a header button that opens a dedicated dialog, matching confirmed orders and other detail pages. Edit public and private metadata without leaving the draft order view.",
    description: "ripple description in What's New",
  },
});

export const rippleDraftOrderMetadata: Ripple = {
  type: "improvement",
  ID: "draft-order-metadata-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 4, 31),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
