import { type Ripple } from "@dashboard/ripples/types";

export const rippleCloudEnvironmentSwitcher: Ripple = {
  type: "feature",
  ID: "cloud-environment-switcher",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  dateAdded: new Date(2026, 9, 21),
  content: {
    oneLiner: "Switch Saleor Cloud environments from the sidebar",
    contextual:
      "Open this menu to switch to another Saleor Cloud environment or to manage this one.",
    global:
      "If you sign in with Saleor Cloud, the menu under the Saleor logo lists your environments. Pick one to open its Dashboard, or choose Manage in Saleor Cloud to open the Cloud console.",
  },
};
