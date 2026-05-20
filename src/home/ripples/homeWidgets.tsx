import { type Ripple } from "@dashboard/ripples/types";

export const rippleHomeWidgets: Ripple = {
  type: "feature",
  ID: "home-widgets",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  content: {
    oneLiner: "Home Page overhauled",
    contextual: "New Home Page is now home for Apps.",
    global:
      "Home Page now mounts Apps, either Saleor official ones or external. Apps can be mounted in fullscreen mode or a widgets grid.",
  },
  dateAdded: new Date(2026, 4),
};
