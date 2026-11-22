import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "NgGAQi",
    defaultMessage: "New order alerts",
    description: "ripple title",
  },
  contextual: {
    id: "3Kc7Yp",
    defaultMessage: "Choose which staff members get an email when a customer places an order.",
    description: "ripple contextual hint",
  },
  global: {
    id: "3rWBzU",
    defaultMessage:
      "Staff emails now include a New order alerts list. Assign active staff members so they are emailed when a customer completes checkout. Draft orders you complete in the Dashboard are not included.",
    description: "ripple description in What's New",
  },
});

export const rippleStaffOrderAlertRecipients: Ripple = {
  type: "feature",
  ID: "staff-order-alert-recipients",
  TTL_seconds: 60 * 60 * 24 * 7,
  dateAdded: new Date(2026, 7, 31),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
