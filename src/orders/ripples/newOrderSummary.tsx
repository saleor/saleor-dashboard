import { Ripple } from "@dashboard/ripples/types";

export const rippleRefreshedOrderSections: Ripple = {
  type: "improvement",
  ID: "refreshed-order-sections",
  TTL_seconds: 60 * 60 * 24 * 3, // 3 days
  content: {
    oneLiner: "Refreshed Order Sections",
    contextual: "We have refreshed Order Summary, Transactions and History sections.",
    global:
      "We redesigned the Order page look - welcome the refreshed Order Summary, Transactions, and History sections with improved data visualization and faster loading times.",
  },
  dateAdded: new Date(2025, 11, 17),
};
