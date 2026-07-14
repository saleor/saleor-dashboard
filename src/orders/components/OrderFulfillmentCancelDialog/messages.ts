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
    id: "xzgaxr",
    defaultMessage:
      "Canceling a fulfillment will restock products at the selected warehouse. The warehouse this fulfillment shipped from is pre-selected.",
    description: "dialog description when restock warehouse must be selected",
  },
  waitingForApprovalHint: {
    id: "zIeG3b",
    defaultMessage:
      "This fulfillment has not been approved yet. Canceling removes the pending shipment and does not require restocking inventory.",
    description: "dialog description when canceling unapproved fulfillment",
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
