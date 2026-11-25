import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "KjVABY",
    defaultMessage: "Product metadata in header",
    description: "ripple title",
  },
  contextual: {
    id: "PRFxLt",
    defaultMessage:
      "Product metadata is now edited from this button, which opens a dedicated dialog.",
    description: "ripple contextual hint",
  },
  global: {
    id: "oMwoXr",
    defaultMessage:
      "Product metadata has moved from the bottom of the product page into a header button that opens a dedicated dialog. Public and private metadata are easier to find and edit without scrolling past other sections.",
    description: "ripple description in What's New",
  },
});

export const rippleProductMetadata: Ripple = {
  type: "improvement",
  ID: "product-metadata-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 4, 31),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
