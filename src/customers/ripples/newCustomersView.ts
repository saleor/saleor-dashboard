import { type Ripple } from "@dashboard/ripples/types";

export const rippleNewCustomersView: Ripple = {
  type: "feature",
  ID: "new-customers-view",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  dateAdded: new Date(2026, 4, 26),
  content: {
    oneLiner: "New Customers View",
    contextual:
      "Customer profiles have a refreshed view that makes key customer details easier to scan.",
    global:
      "Customer profiles have a refreshed view that makes customer details easier to scan from the Customers section or directly from an order. Use it to review customer information, addresses, order context, and related customer data faster.",
  },
};
