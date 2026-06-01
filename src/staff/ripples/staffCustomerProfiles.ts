import { type Ripple } from "@dashboard/ripples/types";

export const rippleStaffCustomerProfiles: Ripple = {
  type: "improvement",
  ID: "staff-customer-profiles",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  dateAdded: new Date(2026, 4, 26),
  content: {
    oneLiner: "Staff Customer Profiles",
    contextual: "Staff members who have placed orders are now easier to spot from the staff list.",
    global:
      "Staff members who have placed orders are now marked on the staff list. Their staff profile also links directly to the matching customer profile, so you can review order history and customer details faster.",
  },
};
