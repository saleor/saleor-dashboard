import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "G/yuAZ",
    defaultMessage: "Expandable subcategories in category list",
    description: "ripple title",
  },
  contextual: {
    id: "Z8A4p1",
    defaultMessage:
      "Expand category rows to browse subcategories in place. Large category trees load more children as you go.",
    description: "ripple contextual hint",
  },
  global: {
    id: "ucVAgO",
    defaultMessage:
      "The categories list now supports expandable rows with lazy loading for child categories. You can review nested structures without leaving the list.",
    description: "ripple description in What's New",
  },
});

export const rippleExpandedSubcategories: Ripple = {
  type: "feature",
  ID: "expandable-subcategories",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  dateAdded: new Date(2026, 1, 8),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
