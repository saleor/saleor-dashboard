import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "2Ein92",
    defaultMessage: "Staff Customer Profiles",
    description: "ripple title",
  },
  contextual: {
    id: "BnFGXb",
    defaultMessage:
      "Staff members who have placed orders are now easier to spot from the staff list.",
    description: "ripple contextual hint",
  },
  global: {
    id: "lu5u81",
    defaultMessage:
      "Staff members who have placed orders are now marked on the staff list. Their staff profile also links directly to the matching customer profile, so you can review order history and customer details faster.",
    description: "ripple description in What's New",
  },
});

export const rippleStaffCustomerProfiles: Ripple = {
  type: "improvement",
  ID: "staff-customer-profiles",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  dateAdded: new Date(2026, 4, 26),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
