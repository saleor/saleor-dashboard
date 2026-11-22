import { rippleActionMessages } from "@dashboard/ripples/messages";
import { allRipplesModalOpen } from "@dashboard/ripples/state";
import { type Ripple } from "@dashboard/ripples/types";
import { getDefaultStore } from "jotai";
import { defineMessages } from "react-intl";

const defaultStore = getDefaultStore();

const contentMessages = defineMessages({
  oneLiner: {
    id: "VC+Tt+",
    defaultMessage: "Introducing hints about latest changes",
    description: "ripple title",
  },
  contextual: {
    id: "MMRew+",
    defaultMessage:
      "We are now notifying about new changes in Saleor. You can find all of them here.",
    description: "ripple contextual hint",
  },
  global: {
    id: "2m2hjj",
    defaultMessage:
      'We are now showing latest features directly in the Dashboard. You can find them contextually and in the "Recent changes" modal.',
    description: "ripple description in What's New",
  },
});

export const rippleIntroducedRipples: Ripple = {
  type: "feature",
  TTL_seconds: 60 * 60 * 24 * 2,
  ID: "introducing-ripples",
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
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
