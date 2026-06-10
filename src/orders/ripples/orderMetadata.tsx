import { type Ripple } from "@dashboard/ripples/types";

export const rippleOrderMetadata: Ripple = {
  type: "improvement",
  ID: "order-metadata",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 4, 31),
  content: {
    oneLiner: "Order metadata in header",
    contextual: "Order metadata is now edited from this button, which opens a dedicated dialog.",
    global:
      "Order metadata has moved from the order details page into a header button that opens a dedicated dialog. Public and private metadata are easier to find and edit.",
  },
};
