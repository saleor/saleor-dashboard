import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "82LP5k",
    defaultMessage: "Slug translations",
    description: "ripple title",
  },
  contextual: {
    id: "vI7lD7",
    defaultMessage:
      "Translate slugs for products, categories, collections, and pages in each supported language.",
    description: "ripple contextual hint",
  },
  global: {
    id: "GQ9gu6",
    defaultMessage:
      "Translation pages for products, categories, collections, and pages now include slug fields, so each supported language can have its own localized slug.",
    description: "ripple description in What's New",
  },
});

export const rippleSlugTranslation: Ripple = {
  type: "feature",
  ID: "slug-translation",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 6, 18),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
