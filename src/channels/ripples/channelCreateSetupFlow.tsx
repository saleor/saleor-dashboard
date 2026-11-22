import { channelCreateUrl } from "@dashboard/channels/urls";
import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const messages = defineMessages({
  visitCreate: {
    id: "dSyctO",
    defaultMessage: "Create a channel",
    description: "ripple action",
  },
});

const contentMessages = defineMessages({
  oneLiner: {
    id: "K8gLdf",
    defaultMessage: "Faster channel setup",
    description: "ripple title",
  },
  contextual: {
    id: "leS/KD",
    defaultMessage:
      "Create a channel—like a market—with name, country, and currency, then set up warehouses and shipping without leaving the page.",
    description: "ripple contextual hint",
  },
  global: {
    id: "W6/6A4",
    defaultMessage:
      "Adding a channel is simpler: pick where you sell, we apply standard order defaults, then guide you to set up stock and shipping in place.",
    description: "ripple description in What's New",
  },
});

export const channelCreateSetupFlow: Ripple = {
  type: "feature",
  ID: "channel-create-setup-flow",
  TTL_seconds: 60 * 60 * 24 * 14, // 14 days
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
  dateAdded: new Date("2026-07-30"),
  actions: [
    {
      label: messages.visitCreate,
      href: channelCreateUrl(),
    },
  ],
};
