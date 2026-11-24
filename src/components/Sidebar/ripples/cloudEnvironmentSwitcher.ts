import { type Ripple } from "@dashboard/ripples/types";

export const rippleCloudEnvironmentSwitcher: Ripple = {
  type: "feature",
  ID: "cloud-environment-header",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  dateAdded: new Date(2026, 10, 19),
  content: {
    oneLiner: "Switch your Saleor Cloud environments here",
    contextual: "You can quickly switch between your Saleor Cloud environments here.",
    global:
      "If you sign in with Saleor Cloud, the sidebar shows the current environment. Click it to quickly switch between your Saleor Cloud environments.",
  },
};
