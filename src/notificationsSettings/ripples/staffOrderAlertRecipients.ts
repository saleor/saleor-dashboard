import { type Ripple } from "@dashboard/ripples/types";

export const rippleStaffOrderAlertRecipients: Ripple = {
  type: "feature",
  ID: "staff-order-alert-recipients",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 7, 31),
  content: {
    oneLiner: "New order alerts",
    contextual: "Choose which staff members get an email when a customer places an order.",
    global:
      "Staff emails now include a New order alerts list. Assign active staff members so they are emailed when a customer completes checkout. Draft orders you complete in the Dashboard are not included.",
  },
};
