import { rippleActionMessages } from "@dashboard/ripples/messages";
import { type Ripple } from "@dashboard/ripples/types";

export const rippleNewReturnReasons: Ripple = {
  type: "feature",
  ID: "new-return-reasons",
  TTL_seconds: 60 * 60 * 24 * 2, // 2 days
  content: {
    oneLiner: "Structured return reasons",
    contextual: "Return reasons are now more powerful with pre-defined choices",
    global:
      "Return reasons are now more powerful. You can add a reason to a return, both overall and per line. Additionally, you can configure returns to use structured data to enforce specific reasons to be provided.",
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
