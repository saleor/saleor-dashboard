import { type Ripple } from "@dashboard/ripples/types";

export const rippleNavigationPins: Ripple = {
  type: "feature",
  ID: "navigation-pins",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  content: {
    oneLiner: "Model types can be pinned to navigation",
    contextual: "You can pin this model to navigation for quicker access.",
    global:
      "Model types can be pinned to the sidebar as shortcuts that reopen the models list filtered to that type. Pins land in the Favorites section or an existing section, up to three per section. Your own pins can be managed in account settings, or removed by hovering the sidebar row; users with settings permission can also pin for the whole organization.",
  },
  dateAdded: new Date(2026, 7, 18),
  actions: [],
};
