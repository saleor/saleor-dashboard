import { defineMessages } from "react-intl";

export const actionButtonsMessages = defineMessages({
  refund: {
    defaultMessage: "Refund",
    description: "refund button"
  },
  editTracking: {
    defaultMessage: "Edit tracking",
    description: "edit tracking button"
  },
  addTracking: {
    defaultMessage: "Add tracking",
    description: "add tracking button"
  }
});

export const extraInfoMessages = defineMessages({
  fulfilled: {
    defaultMessage: "Fulfilled from: ",
    description: "fulfillment group"
  },
  restocked: {
    defaultMessage: "Restocked from: ",
    description: "restocked group"
  },
  tracking: {
    defaultMessage: "Tracking Number: {trackingNumber}",
    description: "tracking number"
  }
});
