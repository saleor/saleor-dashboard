import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "pJ8bK/",
    defaultMessage: "New Customers View",
    description: "ripple title",
  },
  contextual: {
    id: "NNY5lM",
    defaultMessage:
      "Customer profiles have a refreshed view that makes key customer details easier to scan.",
    description: "ripple contextual hint",
  },
  global: {
    id: "w9qswy",
    defaultMessage:
      "Customer profiles have a refreshed view that makes customer details easier to scan from the Customers section or directly from an order. Use it to review customer information, addresses, order context, and related customer data faster.",
    description: "ripple description in What's New",
  },
});

export const rippleNewCustomersView: Ripple = {
  type: "feature",
  ID: "new-customers-view",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  dateAdded: new Date(2026, 4, 26),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
