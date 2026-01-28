import { Ripple } from "@dashboard/ripples/types";

export const rippleCloudEnvLink: Ripple = {
  type: "improvement",
  ID: "cloud-env-link-logo",
  TTL_seconds: 60 * 60 * 24 * 3, // 3 days
  content: {
    oneLiner: "Saleor Cloud link moved to logo area",
    contextual: "The link to Saleor Cloud has moved here. Click the cloud icon to access it.",
    global:
      "The Saleor Cloud environment link has been moved from the bottom of the navigation to the logo area at the top. Hover over the logo to reveal the cloud icon and access your environment.",
  },
  dateAdded: new Date(2025, 11, 18),
};
