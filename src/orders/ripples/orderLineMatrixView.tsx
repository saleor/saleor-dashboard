import { type Ripple } from "@dashboard/ripples/types";

export const rippleOrderLineMatrixView: Ripple = {
  type: "feature",
  ID: "order-line-matrix-view",
  TTL_seconds: 60 * 60 * 24 * 14,
  dateAdded: new Date(2026, 6, 10),
  content: {
    oneLiner: "Line matrix view",
    contextual:
      "Switch to Line matrix to see ordered, shipped, and returned quantities for every item in one table.",
    global:
      "Order details now include a Line matrix view alongside the existing Timeline. See fulfillment lifecycle quantities per item, click a line's status to manage shipments, and switch back anytime.",
  },
};
