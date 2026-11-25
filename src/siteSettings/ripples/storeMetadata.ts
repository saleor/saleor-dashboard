import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "F0uYnh",
    defaultMessage: "Store metadata in settings",
    description: "ripple title",
  },
  contextual: {
    id: "N4Q6EZ",
    defaultMessage: "View and edit the store's public and private metadata from this button.",
    description: "ripple contextual hint",
  },
  global: {
    id: "2SM+4U",
    defaultMessage:
      "Settings → Store now has a header button that opens the store's metadata, so public and private store metadata can be viewed and edited in the dashboard, like on channels and warehouses.",
    description: "ripple description in What's New",
  },
});

export const rippleStoreMetadata: Ripple = {
  type: "feature",
  ID: "store-metadata-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 10, 14),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
