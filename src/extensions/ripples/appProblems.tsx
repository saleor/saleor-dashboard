import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "+nsMt3",
    defaultMessage: "App problems visibility",
    description: "ripple title",
  },
  contextual: {
    id: "NJVCpQ",
    defaultMessage: "You can now see issues with apps directly in the extensions list.",
    description: "ripple contextual hint",
  },
  global: {
    id: "f0OZkZ",
    defaultMessage:
      "App problems are now visible in the installed extensions page. When an app has issues, you will see a badge indicating the number of problems and their severity.",
    description: "ripple description in What's New",
  },
});

export const rippleAppProblems: Ripple = {
  type: "feature",
  ID: "app-problems",
  TTL_seconds: 60 * 60 * 24 * 2, // 2 days
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
  dateAdded: new Date(2026, 1),
};
