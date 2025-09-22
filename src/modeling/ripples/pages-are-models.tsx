import { Ripple } from "@dashboard/ripples/types";
import { defineMessage } from "react-intl";

export const ripplePagesAreModels: Ripple = {
  ID: "pages-are-models",
  TTL: 60 * 60 * 24 * 2, // 2 days
  content: {
    contextual: "Pages are now called Models",
    global:
      "We have renamed Pages to Models. API still uses the old naming, but we it will change in the future.",
  },
  // Approx June it was changed in the dashboard
  dateAdded: new Date(2025, 5, 1),
  actions: [
    {
      label: defineMessage({
        defaultMessage: "Test",
        id: "xu6eM8",
      }),
      onClick() {},
    },
  ],
};
