import { type Ripple } from "@dashboard/ripples/types";

export const rippleCustomerOverview: Ripple = {
  type: "feature",
  ID: "customer-overview",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  dateAdded: new Date(2026, 4, 26),
  content: {
    oneLiner: "Customer Overview",
    contextual:
      "Customer profiles now start with a quick overview of order activity, login history, recent spend, and average order value.",
    global:
      "Customer profiles now include a compact overview with total orders, last login, recent spend, and average order value. When a customer has recent orders in multiple currencies, spend and average order value are shown separately for each currency so each figure stays clear.",
  },
};
