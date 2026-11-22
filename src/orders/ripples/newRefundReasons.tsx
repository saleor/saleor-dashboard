import { rippleActionMessages } from "@dashboard/ripples/messages";
import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "CrFb2y",
    defaultMessage: "Structured refund reasons",
    description: "ripple title",
  },
  contextual: {
    id: "QRGrjE",
    defaultMessage: "Refund reasons are now more powerful with pre-defined choices",
    description: "ripple contextual hint",
  },
  global: {
    id: "LkoPrm",
    defaultMessage:
      'Refund reasons are now more powerful. You can add reason to the "manual refund". Additionally, you can configure refunds to use structured data to enforce specific reasons to be provided when refunds are issued.',
    description: "ripple description in What's New",
  },
});

export const rippleNewRefundReasons: Ripple = {
  type: "feature",
  ID: "new-refund-reasons",
  TTL_seconds: 60 * 60 * 24 * 2, // 2 days
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
  // Added in 3.22
  dateAdded: new Date(2025, 8, 1),
  actions: [
    {
      label: rippleActionMessages.readTheBlogPost,
      href: "https://saleor.io/blog/refund-reasons",
    },
  ],
};
