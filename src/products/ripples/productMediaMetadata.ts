import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "C1P52i",
    defaultMessage: "Media metadata in header",
    description: "ripple title",
  },
  contextual: {
    id: "mvLCpc",
    defaultMessage:
      "Media metadata is now edited from this button, which opens a dedicated dialog.",
    description: "ripple contextual hint",
  },
  global: {
    id: "BP48rz",
    defaultMessage:
      "Product media items now have a header metadata button on the edit media page. You can manage public and private metadata for each image or video without leaving the preview.",
    description: "ripple description in What's New",
  },
});

export const rippleProductMediaMetadata: Ripple = {
  type: "improvement",
  ID: "product-media-metadata-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 5, 3),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
