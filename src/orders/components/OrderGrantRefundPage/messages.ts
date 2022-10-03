import { defineMessages } from "react-intl";

export const grantRefundPageMessages = defineMessages({
  pageHeader: {
    defaultMessage: "Grant refund",
    id: "+mmPxn",
    description: "page header",
  },
  pageSubtitle: {
    defaultMessage:
      "Refunded amount will not be automatically returned to the customer. You’ll need to decide on a method and refund via balance sheet section of the order.",
    id: "Ys86kI",
  },
  reasonForRefund: {
    defaultMessage: "Reason for refund",
    id: "cBVHN5",
    description: "grant refund, reason input field placeholder",
  },
  refundTitle: {
    defaultMessage: "Refund",
    id: "sFynTT",
    description: "grant refund, refund card title",
  },
  refundSubtitle: {
    defaultMessage:
      "How much money do you want to return to the customer for the order?",
    id: "iFM716",
    description: "grant refund, refund card subtitle",
  },
  refundShipment: {
    defaultMessage: "Refund shipment: {currency} {amount}",
    id: "Tenl9A",
    description: "grant refund, refund card toggle",
  },
  refundSelectedValue: {
    defaultMessage: "Selected refund value:",
    id: "kJYa8Y",
    description: "grant refund, refund card calculated refund value",
  },
  refundStepExplanation: {
    defaultMessage: "Funds will be returned in a separate step",
    id: "C035fF",
    description: "grant refund, refund card explanation next to submit button",
  },
  setMaxQuantity: {
    defaultMessage: "Set max. quantities",
    id: "xGC2Ge",
    description: "grant refund, button",
  },
  unfulfilledProducts: {
    defaultMessage: "Unfulfilled products",
    id: "zfjAc7",
    description: "grant refund, card header",
  },
  fulfilment: {
    defaultMessage: "Fulfillment",
    id: "WK62MN",
  },
});
