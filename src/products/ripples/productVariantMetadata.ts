import { type Ripple } from "@dashboard/ripples/types";

export const rippleProductVariantMetadata: Ripple = {
  type: "improvement",
  ID: "product-variant-metadata-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 4, 31),
  content: {
    oneLiner: "Variant metadata in header",
    contextual: "Variant metadata is now edited from this button, which opens a dedicated dialog.",
    global:
      "Variant metadata has moved from the variant details page into a header button that opens a dedicated dialog. You can manage public and private metadata without scrolling past inventory and attribute sections.",
  },
};
