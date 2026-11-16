import { type Ripple } from "@dashboard/ripples/types";

export const rippleTaxConfigurationMetadata: Ripple = {
  type: "feature",
  ID: "tax-configuration-metadata-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 10, 14),
  content: {
    oneLiner: "Tax configuration metadata",
    contextual: "View and edit the selected channel's tax configuration metadata from this button.",
    global:
      "Taxes → Channels now has a header button that opens the selected channel's tax configuration metadata, so its public and private metadata can be viewed and edited in the dashboard.",
  },
};
