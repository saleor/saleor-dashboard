import { defineMessages } from "react-intl";

export const orderFulfillmentCancelDialogMessages = defineMessages({
  title: {
    id: "bb4nSp",
    defaultMessage: "Cancel Fulfillment",
    description: "dialog header",
  },
  description: {
    id: "7YSzeP",
    defaultMessage: "Are you sure you want to cancel fulfillment?",
    description: "dialog description",
  },
  restockHint: {
    id: "GU+ikh",
    defaultMessage: "Canceling a fulfillment will restock products at a selected warehouse.",
    description: "dialog description when restock warehouse must be selected",
  },
  warehouseLabel: {
    id: "aHc89n",
    defaultMessage: "Select Warehouse",
    description: "select warehouse to restock items",
  },
  confirmButton: {
    id: "hJj8QA",
    defaultMessage: "Cancel fulfillment",
    description: "button to confirm fulfillment cancellation",
  },
});
