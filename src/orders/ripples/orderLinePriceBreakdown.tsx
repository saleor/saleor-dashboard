import { type Ripple } from "@dashboard/ripples/types";

export const rippleOrderLinePriceBreakdown: Ripple = {
  type: "feature",
  ID: "order-line-price-breakdown",
  TTL_seconds: 60 * 60 * 24 * 14,
  content: {
    oneLiner: "See how a line price was calculated",
    contextual: "Click a discounted unit price or line total to open a step-by-step breakdown.",
    global:
      "On confirmed orders, click a discounted unit price or line total to see a read-only breakdown of how it was calculated — promotions, vouchers, and manual or order-wide discounts.",
  },
  dateAdded: new Date(2026, 4, 11),
};
