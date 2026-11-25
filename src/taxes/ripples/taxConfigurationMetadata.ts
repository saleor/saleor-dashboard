import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "0in3hd",
    defaultMessage: "Tax configuration metadata",
    description: "ripple title",
  },
  contextual: {
    id: "IGpJAf",
    defaultMessage:
      "View and edit the selected channel's tax configuration metadata from this button.",
    description: "ripple contextual hint",
  },
  global: {
    id: "B2vGbM",
    defaultMessage:
      "Taxes → Channels now has a header button that opens the selected channel's tax configuration metadata, so its public and private metadata can be viewed and edited in the dashboard.",
    description: "ripple description in What's New",
  },
});

export const rippleTaxConfigurationMetadata: Ripple = {
  type: "feature",
  ID: "tax-configuration-metadata-header",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 10, 14),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
