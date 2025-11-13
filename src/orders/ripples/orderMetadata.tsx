import { Ripple } from "@dashboard/ripples/types";

export const rippleOrderMetadata: Ripple = {
  ID: "order-metadata",
  TTL_seconds: 60 * 60 * 24 * 3, // 3 days
  content: {
    oneLiner: "Order metadata editing moved to dialog",
    contextual: "Order metadata is now edited via this button which opens a dedicated dialog",
    global:
      "Order metadata editing has been moved from an inline card to a dedicated dialog for better organization and easier editing.",
  },
  dateAdded: new Date("2025-11-10"),
};
