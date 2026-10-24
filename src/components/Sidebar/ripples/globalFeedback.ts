import { type Ripple } from "@dashboard/ripples/types";

export const rippleGlobalFeedback: Ripple = {
  type: "feature",
  ID: "global-feedback-button",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  dateAdded: new Date(2026, 8, 14),
  content: {
    oneLiner: "Send feedback from anywhere",
    contextual: "Share feedback with us from anywhere in the Dashboard.",
    global:
      "Use the new Send feedback button next to your account menu to share feedback from anywhere in the Dashboard.",
  },
};
