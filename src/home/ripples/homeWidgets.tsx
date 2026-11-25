import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "KbgZvt",
    defaultMessage: "Home Page overhauled",
    description: "ripple title",
  },
  contextual: {
    id: "yzpuzU",
    defaultMessage: "New Home Page is now home for Apps.",
    description: "ripple contextual hint",
  },
  global: {
    id: "6whCPA",
    defaultMessage:
      "Home Page now mounts Apps, either Saleor official ones or external. Apps can be mounted in fullscreen mode or a widgets grid.",
    description: "ripple description in What's New",
  },
});

export const rippleHomeWidgets: Ripple = {
  type: "feature",
  ID: "home-widgets",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
  dateAdded: new Date(2026, 4),
};
