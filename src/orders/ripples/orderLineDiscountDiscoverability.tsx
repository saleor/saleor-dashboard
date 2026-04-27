import { type Ripple } from "@dashboard/ripples/types";

export const rippleOrderLineDiscountDiscoverability: Ripple = {
  type: "improvement",
  ID: "order-line-discount-discoverability",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  content: {
    oneLiner: "Line discounts are easier to find",
    contextual:
      "Use this row menu to add or edit line discounts with one unified flow in Draft and Unconfirmed orders.",
    global:
      "Order-level and order-line discount flows now share the same UX in Draft and Unconfirmed orders. Access Add/Edit order line discount now also from the order row menu.",
  },
  dateAdded: new Date(2026, 2, 17),
};
