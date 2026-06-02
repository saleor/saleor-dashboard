import { type Ripple } from "@dashboard/ripples/types";

export const rippleProductMetadata: Ripple = {
  type: "improvement",
  ID: "product-metadata-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 4, 31),
  content: {
    oneLiner: "Product metadata in header",
    contextual: "Product metadata is now edited from this button, which opens a dedicated dialog.",
    global:
      "Product metadata has moved from the bottom of the product page into a header button that opens a dedicated dialog. Public and private metadata are easier to find and edit without scrolling past other sections.",
  },
};
