import { rippleActionMessages } from "@dashboard/ripples/messages";
import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "U7hPLa",
    defaultMessage: "Structured return reasons",
    description: "ripple title",
  },
  contextual: {
    id: "4MLyB4",
    defaultMessage: "Return reasons are now more powerful with pre-defined choices",
    description: "ripple contextual hint",
  },
  global: {
    id: "nD92RE",
    defaultMessage:
      "Return reasons are now more powerful. You can add a reason to a return, both overall and per line. Additionally, you can configure returns to use structured data to enforce specific reasons to be provided.",
    description: "ripple description in What's New",
  },
});

export const rippleNewReturnReasons: Ripple = {
  type: "feature",
  ID: "new-return-reasons",
  TTL_seconds: 60 * 60 * 24 * 2, // 2 days
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
  // Added in 3.23
  dateAdded: new Date(2026, 5, 16),
  actions: [
    {
      label: rippleActionMessages.readTheBlogPost,
      href: "https://saleor.io/blog/refund-reasons",
    },
  ],
};
