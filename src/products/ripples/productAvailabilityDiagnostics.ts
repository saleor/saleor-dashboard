import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "IzsiS3",
    defaultMessage: "Redesigned Product Availability",
    description: "ripple title",
  },
  contextual: {
    id: "YIE14G",
    defaultMessage:
      "Redesigned publishing and purchasability management with new diagnostics to identify why products may not be purchasable.",
    description: "ripple contextual hint",
  },
  global: {
    id: "a4x7uX",
    defaultMessage:
      "The Product Availability card has been completely redesigned for better UX. It now offers streamlined publishing and purchasability management, real-time diagnostics that detect issues preventing products from being purchased, public API verification, and actionable recommendations to fix configuration problems.",
    description: "ripple description in What's New",
  },
});

export const rippleProductAvailabilityDiagnostics: Ripple = {
  type: "feature",
  ID: "product-availability-diagnostics",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
  dateAdded: new Date(2026, 0, 28),
};
