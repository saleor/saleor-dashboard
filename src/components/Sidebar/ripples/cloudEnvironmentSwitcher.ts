import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "ENFwfZ",
    defaultMessage: "Switch your Saleor Cloud environments here",
    description: "ripple title",
  },
  contextual: {
    id: "oV2dym",
    defaultMessage: "You can quickly switch between your Saleor Cloud environments here.",
    description: "ripple contextual hint",
  },
  global: {
    id: "ZTR+LK",
    defaultMessage:
      "If you sign in with Saleor Cloud, the sidebar shows the current environment. Click it to quickly switch between your Saleor Cloud environments.",
    description: "ripple description in What's New",
  },
});

export const rippleCloudEnvironmentSwitcher: Ripple = {
  type: "feature",
  ID: "cloud-environment-header",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  dateAdded: new Date(2026, 10, 19),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
