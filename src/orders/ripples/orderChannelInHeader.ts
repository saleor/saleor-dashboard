import { type Ripple } from "@dashboard/ripples/types";

export const rippleOrderChannelInHeader: Ripple = {
  type: "improvement",
  ID: "order-channel-in-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  content: {
    oneLiner: "Order Channel in Header",
    contextual:
      "Sales channel now appears in the order header. Click it to view other orders from the same channel.",
    global:
      "Sales channel is now shown directly in the order header, next to the order date and status. Click the channel to open the orders list filtered to the same channel, instead of jumping to channel settings.",
  },
  dateAdded: new Date(2026, 4, 26),
};
