import { type Ripple } from "@dashboard/ripples/types";

export const rippleDraftOrderMetadata: Ripple = {
  type: "improvement",
  ID: "draft-order-metadata-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 4, 31),
  content: {
    oneLiner: "Draft order metadata in header",
    contextual:
      "Draft order metadata is now edited from this button, which opens a dedicated dialog.",
    global:
      "Draft order metadata is now available from a header button that opens a dedicated dialog, matching confirmed orders and other detail pages. Edit public and private metadata without leaving the draft order view.",
  },
};
