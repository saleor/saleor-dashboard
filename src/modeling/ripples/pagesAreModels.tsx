import { rippleActionMessages } from "@dashboard/ripples/messages";
import { Ripple } from "@dashboard/ripples/types";

export const ripplePagesAreModels: Ripple = {
  type: "feature",
  ID: "pages-are-models",
  TTL_seconds: 60 * 60 * 24 * 2, // 2 days
  content: {
    oneLiner: "Pages are now called Models",
    contextual: "Pages are now called Models",
    global:
      "We have renamed Pages to Models. API still uses the old naming, but it will change in the future.",
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
