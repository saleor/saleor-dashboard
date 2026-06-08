import { type Ripple } from "@dashboard/ripples/types";

export const rippleProductMediaMetadata: Ripple = {
  type: "improvement",
  ID: "product-media-metadata-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 5, 3),
  content: {
    oneLiner: "Media metadata in header",
    contextual: "Media metadata is now edited from this button, which opens a dedicated dialog.",
    global:
      "Product media items now have a header metadata button on the edit media page. You can manage public and private metadata for each image or video without leaving the preview.",
  },
};
