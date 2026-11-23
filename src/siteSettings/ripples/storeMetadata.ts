import { type Ripple } from "@dashboard/ripples/types";

export const rippleStoreMetadata: Ripple = {
  type: "feature",
  ID: "store-metadata-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 10, 14),
  content: {
    oneLiner: "Store metadata in settings",
    contextual: "View and edit the store's public and private metadata from this button.",
    global:
      "Settings → Store now has a header button that opens the store's metadata, so public and private store metadata can be viewed and edited in the dashboard, like on channels and warehouses.",
  },
};
