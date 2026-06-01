import { type Ripple } from "@dashboard/ripples/types";

export const rippleModelTypeTabs: Ripple = {
  type: "feature",
  ID: "model-type-tabs",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  content: {
    oneLiner: "Model filters are exposed as tabs",
    contextual: "Filter by model type using the tabs above the list, for the quicker access.",
    global:
      "The Models list now organizes content by model type using tabs instead of a filter dropdown. 'Create' button creates model from the active context",
  },
  dateAdded: new Date(2026, 4, 15),
  actions: [],
};
