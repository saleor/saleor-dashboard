import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "RcCl14",
    defaultMessage: "Line discounts are easier to find",
    description: "ripple title",
  },
  contextual: {
    id: "EeG9W0",
    defaultMessage:
      "Use this row menu to add or edit line discounts with one unified flow in Draft and Unconfirmed orders.",
    description: "ripple contextual hint",
  },
  global: {
    id: "LmQplG",
    defaultMessage:
      "Order-level and order-line discount flows now share the same UX in Draft and Unconfirmed orders. Access Add/Edit order line discount now also from the order row menu.",
    description: "ripple description in What's New",
  },
});

export const rippleOrderLineDiscountDiscoverability: Ripple = {
  type: "improvement",
  ID: "order-line-discount-discoverability",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
  dateAdded: new Date(2026, 2, 17),
};
