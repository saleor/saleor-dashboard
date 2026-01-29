import { Ripple } from "@dashboard/ripples/types";

export const rippleProductAvailabilityDiagnostics: Ripple = {
  type: "feature",
  ID: "product-availability-diagnostics",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  content: {
    oneLiner: "Redesigned Product Availability",
    contextual:
      "Redesigned publishing and purchasability management with new diagnostics to identify why products may not be purchasable.",
    global:
      "The Product Availability card has been completely redesigned for better UX. It now offers streamlined publishing and purchasability management, real-time diagnostics that detect issues preventing products from being purchased, public API verification, and actionable recommendations to fix configuration problems.",
  },
  dateAdded: new Date(2026, 0, 28),
};
