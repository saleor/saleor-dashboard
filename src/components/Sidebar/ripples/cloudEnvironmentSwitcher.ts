import { type Ripple } from "@dashboard/ripples/types";

export const rippleCloudEnvironmentSwitcher: Ripple = {
  type: "feature",
  ID: "cloud-environment-header",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  dateAdded: new Date(2026, 10, 19),
  content: {
    oneLiner: "See which Saleor Cloud environment you're in",
    contextual:
      "The sidebar now shows this environment's name and whether it's production or a sandbox. Use this button to search your other environments and switch.",
    global:
      "If you sign in with Saleor Cloud, the sidebar shows the current environment's name, its project and whether it's production or a sandbox. The switch button next to it opens a searchable list of your environments, grouped by project.",
  },
};
