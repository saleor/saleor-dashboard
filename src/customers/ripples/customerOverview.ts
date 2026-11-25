import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "65V1/L",
    defaultMessage: "Customer Overview",
    description: "ripple title",
  },
  contextual: {
    id: "Uy209X",
    defaultMessage:
      "Customer profiles now start with channel-scoped order KPIs: net product sales, shipping and refunds shown separately, plus login history.",
    description: "ripple contextual hint",
  },
  global: {
    id: "YlBh9S",
    defaultMessage:
      "Customer profiles now include a compact overview with total orders, last login, recent net sales, and average order value. Stats are scoped per channel — use the channel selector when a customer shops in multiple stores. Net sales exclude shipping and tax; hover the amount for shipping and refund details from the same orders.",
    description: "ripple description in What's New",
  },
});

export const rippleCustomerOverview: Ripple = {
  type: "feature",
  ID: "customer-overview",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  dateAdded: new Date(2026, 4, 26),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
