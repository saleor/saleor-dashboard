import { Ripple } from "@dashboard/ripples/types";

export const rippleExpandedSubcategories: Ripple = {
  type: "feature",
  ID: "expandable-subcategories",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  dateAdded: new Date(2026, 1, 8),
  content: {
    oneLiner: "Expandable subcategories in category list",
    contextual:
      "Expand category rows to browse subcategories in place. Adjust how many subcategories are loaded with this control.",
    global:
      "The categories list now supports expandable rows with lazy loading for child categories. You can review nested structures without leaving the list and control how many subcategories are fetched per parent.",
  },
};
