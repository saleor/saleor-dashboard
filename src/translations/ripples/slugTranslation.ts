import { type Ripple } from "@dashboard/ripples/types";

export const rippleSlugTranslation: Ripple = {
  type: "feature",
  ID: "slug-translation",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 6, 18),
  content: {
    oneLiner: "Slug translations",
    contextual:
      "Translate slugs for products, categories, collections, and pages in each supported language.",
    global:
      "Translation pages for products, categories, collections, and pages now include slug fields, so each supported language can have its own localized slug.",
  },
};
