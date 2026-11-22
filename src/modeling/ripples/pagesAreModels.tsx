import { rippleActionMessages } from "@dashboard/ripples/messages";
import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "YY7mid",
    defaultMessage: "Pages are now called Models",
    description: "ripple title",
  },
  contextual: {
    id: "7GOVKl",
    defaultMessage: "Pages are now called Models",
    description: "ripple contextual hint",
  },
  global: {
    id: "VA0tXx",
    defaultMessage:
      "We have renamed Pages to Models. API still uses the old naming, but it will change in the future.",
    description: "ripple description in What's New",
  },
});

export const ripplePagesAreModels: Ripple = {
  type: "feature",
  ID: "pages-are-models",
  TTL_seconds: 60 * 60 * 24 * 2, // 2 days
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
  // Approx June it was changed in the dashboard
  dateAdded: new Date(2025, 5, 1),
  actions: [
    {
      label: rippleActionMessages.readTheBlogPost,
      href: "https://saleor.io/blog/modeling",
    },
  ],
};
