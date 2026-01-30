import { Ripple } from "@dashboard/ripples/types";

export const rippleAttributeValuesSearch: Ripple = {
  type: "improvement",
  ID: "attribute-values-search",
  TTL_seconds: 60 * 60 * 24 * 5, // 5 days
  dateAdded: new Date(2026, 0, 29),
  content: {
    oneLiner: "Search Attribute Values",
    contextual: "Quickly find attribute values by name.",
    global:
      "You can now search through attribute values directly from the attribute details page. Find any value instantly, even in attributes with hundreds of options.",
  },
};
