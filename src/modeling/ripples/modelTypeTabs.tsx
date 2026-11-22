import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "OdyqHH",
    defaultMessage: "Model filters are exposed as tabs",
    description: "ripple title",
  },
  contextual: {
    id: "+mG41z",
    defaultMessage: "Filter by model type using the tabs above the list, for the quicker access.",
    description: "ripple contextual hint",
  },
  global: {
    id: "i7Ifr5",
    defaultMessage:
      "The Models list now organizes content by model type using tabs instead of a filter dropdown. 'Create' button creates model from the active context",
    description: "ripple description in What's New",
  },
});

export const rippleModelTypeTabs: Ripple = {
  type: "feature",
  ID: "model-type-tabs",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
  dateAdded: new Date(2026, 4, 15),
  actions: [],
};
