import { rippleActionMessages } from "@dashboard/ripples/messages";
import { allRipplesModalOpen } from "@dashboard/ripples/state";
import { Ripple } from "@dashboard/ripples/types";
import { getDefaultStore } from "jotai";

const defaultStore = getDefaultStore();

export const rippleIntroducedRipples: Ripple = {
  type: "feature",
  TTL_seconds: 60 * 60 * 24 * 2,
  ID: "introducing-ripples",
  content: {
    oneLiner: "Introducing hints about latest changes",
    contextual: "We are now notifying about new changes in Saleor. You can find all of them here.",
    global:
      'We are now showing latest features directly in the Dashboard. You can find them contextually and in the "Recent changes" modal.',
  },
  dateAdded: new Date(2025, 8),
  actions: [
    {
      label: rippleActionMessages.showMe,
      onClick() {
        defaultStore.set(allRipplesModalOpen, true);
      },
      hideInModal: true,
    },
  ],
};
