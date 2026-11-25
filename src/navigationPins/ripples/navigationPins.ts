import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "0NCTop",
    defaultMessage: "Model types can be pinned to navigation",
    description: "ripple title",
  },
  contextual: {
    id: "xF9pFT",
    defaultMessage: "You can pin this model to navigation for quicker access.",
    description: "ripple contextual hint",
  },
  global: {
    id: "JfIQ7J",
    defaultMessage:
      "Model types can be pinned to the sidebar as shortcuts that reopen the models list filtered to that type. Pins land in the Favorites section or an existing section, up to three per section. Your own pins can be managed in account settings, or removed by hovering the sidebar row; users with settings permission can also pin for the whole organization.",
    description: "ripple description in What's New",
  },
});

export const rippleNavigationPins: Ripple = {
  type: "feature",
  ID: "navigation-pins",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
  dateAdded: new Date(2026, 7, 18),
  actions: [],
};
