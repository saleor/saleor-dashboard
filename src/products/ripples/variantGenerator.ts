import { Ripple } from "@dashboard/ripples/types";

export const rippleVariantGenerator: Ripple = {
  type: "feature",
  ID: "bulk-variant-generator",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  content: {
    oneLiner: "Bulk Variant Generator",
    contextual: "Quickly create all product variant combinations by selecting attribute values.",
    global:
      "Quickly create all product variant combinations by selecting attribute values, with live preview, optional SKU/stock defaults, and automatic skipping of existing variants.",
  },
  dateAdded: new Date(2026, 0, 28),
};
