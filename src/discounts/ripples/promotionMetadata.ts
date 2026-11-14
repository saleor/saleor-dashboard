import { type Ripple } from "@dashboard/ripples/types";

export const ripplePromotionMetadata: Ripple = {
  type: "feature",
  ID: "promotion-metadata-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 10, 14),
  content: {
    oneLiner: "Promotion metadata",
    contextual: "View and edit the promotion's public and private metadata from this button.",
    global:
      "Promotion pages now have a header button that opens the promotion's metadata, so public and private promotion metadata can be viewed and edited in the dashboard, like on vouchers.",
  },
};
