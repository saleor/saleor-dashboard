import { defineMessages } from "react-intl";

export const messages = defineMessages({
  cancelFulfillment: {
    defaultMessage: "Cancel Fulfillment",
    description: "button"
  }
});

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
  },
  cannotFullfillWarning: {
    defaultMessage: "Can’t fulfill until payment is captured",
    description: "approve button disable description"
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
