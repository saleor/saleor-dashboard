import { type Ripple } from "@dashboard/ripples/types";

export const rippleProductMediaAltTranslation: Ripple = {
  type: "feature",
  ID: "product-media-alt-translation",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 7, 31),
  content: {
    oneLiner: "Product media alt text translations",
    contextual: "You can now translate alt text for each product media item.",
    global:
      "Product translations now include a Media view with a preview and an Alt text field for each image or video.",
  },
};
