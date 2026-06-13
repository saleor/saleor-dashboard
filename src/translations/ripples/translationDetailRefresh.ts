import { type Ripple } from "@dashboard/ripples/types";

export const rippleTranslationDetailRefresh: Ripple = {
  type: "feature",
  ID: "translation-detail-refresh",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 5, 13),
  content: {
    oneLiner: "Bulk Translation Editing",
    contextual:
      "Turn on bulk edit to translate several fields at once, then save everything with one click.",
    global:
      "Translation pages now show your progress and group fields into clear sections. Use bulk edit to update multiple fields in one pass, and see at a glance which fields still need a translation before you move on to the next item.",
  },
};
