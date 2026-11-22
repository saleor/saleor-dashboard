import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "ubxVZk",
    defaultMessage: "Search Attribute Values",
    description: "ripple title",
  },
  contextual: {
    id: "udQAbg",
    defaultMessage: "Quickly find attribute values by name.",
    description: "ripple contextual hint",
  },
  global: {
    id: "2ofnDv",
    defaultMessage:
      "You can now search through attribute values directly from the attribute details page. Find any value instantly, even in attributes with hundreds of options.",
    description: "ripple description in What's New",
  },
});

export const rippleAttributeValuesSearch: Ripple = {
  type: "improvement",
  ID: "attribute-values-search",
  TTL_seconds: 60 * 60 * 24 * 5, // 5 days
  dateAdded: new Date(2026, 0, 29),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
