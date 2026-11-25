import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "1kPAyt",
    defaultMessage: "Send feedback from anywhere",
    description: "ripple title",
  },
  contextual: {
    id: "AZpBZ9",
    defaultMessage: "Share feedback with us from anywhere in the Dashboard.",
    description: "ripple contextual hint",
  },
  global: {
    id: "pHsY0U",
    defaultMessage:
      "Use the new Send feedback button next to your account menu to share feedback from anywhere in the Dashboard.",
    description: "ripple description in What's New",
  },
});

export const rippleGlobalFeedback: Ripple = {
  type: "feature",
  ID: "global-feedback-button",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  dateAdded: new Date(2026, 8, 14),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
