import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "MBZw1O",
    defaultMessage: "Product media alt text translations",
    description: "ripple title",
  },
  contextual: {
    id: "kHe+pI",
    defaultMessage: "You can now translate alt text for each product media item.",
    description: "ripple contextual hint",
  },
  global: {
    id: "0L7d1N",
    defaultMessage:
      "Product translations now include a Media view with a preview and an Alt text field for each image or video.",
    description: "ripple description in What's New",
  },
});

export const rippleProductMediaAltTranslation: Ripple = {
  type: "feature",
  ID: "product-media-alt-translation",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 7, 31),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
