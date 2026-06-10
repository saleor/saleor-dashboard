import { type Ripple } from "@dashboard/ripples/types";

export const rippleProductTypeInHeader: Ripple = {
  type: "improvement",
  ID: "product-type-in-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  content: {
    oneLiner: "Product type in header",
    contextual:
      "Product type is now next to the product name. Click it to see all products of this type, or use More actions for type settings.",
    global:
      "On the product details page, the product type appears in the header beside the product name—similar to how orders show their sales channel. Click the type to jump to your product list filtered to that type. To change attributes, variants, or other type options, choose Product type settings from the More actions menu at the top of the page.",
  },
  dateAdded: new Date(2026, 4, 30),
};
