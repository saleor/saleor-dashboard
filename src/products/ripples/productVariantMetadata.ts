import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "pe6wWH",
    defaultMessage: "Variant metadata in header",
    description: "ripple title",
  },
  contextual: {
    id: "h7bbyw",
    defaultMessage:
      "Variant metadata is now edited from this button, which opens a dedicated dialog.",
    description: "ripple contextual hint",
  },
  global: {
    id: "XhVh0N",
    defaultMessage:
      "Variant metadata has moved from the variant details page into a header button that opens a dedicated dialog. You can manage public and private metadata without scrolling past inventory and attribute sections.",
    description: "ripple description in What's New",
  },
});

export const rippleProductVariantMetadata: Ripple = {
  type: "improvement",
  ID: "product-variant-metadata-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 4, 31),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
