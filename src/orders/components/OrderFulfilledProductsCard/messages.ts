import { defineMessages } from "react-intl";

export const actionButtonsMessages = defineMessages({
  refund: {
    id: "K//bUK",
    defaultMessage: "Refund",
    description: "refund button",
  },
  editTracking: {
    id: "dTkmON",
    defaultMessage: "Edit tracking",
    description: "edit tracking button",
  },
  addTracking: {
    id: "bS7A8u",
    defaultMessage: "Add tracking",
    description: "add tracking button",
  },
});

export const extraInfoMessages = defineMessages({
  fulfilled: {
    id: "lOMgms",
    defaultMessage: "Fulfilled from: ",
    description: "fulfillment group",
  },
  restocked: {
    id: "f/R1Ln",
    defaultMessage: "Restocked from: ",
    description: "restocked group",
  },
  tracking: {
    id: "4PlW0w",
    defaultMessage: "Tracking Number: {trackingNumber}",
    description: "tracking number",
  },
});
