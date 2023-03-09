import { defineMessages } from "react-intl";

export const orderTitleMessages = defineMessages({
  canceled: {
    defaultMessage: "Canceled",
    id: "Z7lX6t",
    description: "canceled fulfillment, section header",
  },
  fulfilled: {
    id: "16iwCI",
    defaultMessage: "Fulfilled",
    description: "section header",
  },
  refunded: {
    id: "+SYLEL",
    defaultMessage: "Refunded",
    description: "refunded fulfillment, section header",
  },
  refundedAndReturned: {
    id: "LJPHdt",
    defaultMessage: "Refunded and Returned",
    description: "cancelled fulfillment, section header",
  },
  replaced: {
    id: "jz2SlO",
    defaultMessage: "Replaced",
    description: "refunded fulfillment, section header",
  },
  returned: {
    id: "Z8TzWt",
    defaultMessage: "Returned",
    description: "refunded fulfillment, section header",
  },
  waitingForApproval: {
    id: "DyGpz4",
    defaultMessage: "Waiting for approval",
    description: "unapproved fulfillment, section header",
  },
  unfulfilled: {
    defaultMessage: "Unfulfilled",
    id: "/xXvjF",
    description: "section header",
  },
  fulfilledFrom: {
    id: "ZPOyI1",
    defaultMessage: "Fulfilled from {warehouseName}",
    description: "fulfilled fulfillment, section header",
  },
});
