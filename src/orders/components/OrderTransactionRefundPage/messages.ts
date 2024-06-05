import { defineMessages } from "react-intl";

export const orderTransactionRefundMessages = defineMessages({
  editRefundTitle: {
    defaultMessage: "Edit refund wiht line items",
    id: "gF6ueC",
    description: "edit refund title",
  },
  createRefundTitle: {
    defaultMessage: "Create refund with line items",
    id: "wkeWw9",
    description: "create refund title",
  },
  selectQuantitiesToRefund: {
    defaultMessage: "Select quantities to refund",
    id: "LwU0Vy",
    description: "datagrid title label",
  },
  selectTransactionToRefund: {
    defaultMessage: "Select transaction to refund",
    id: "4EdlF/",
    description: "datagrid title label",
  },
  amountError: {
    id: "vUY6ir",
    defaultMessage: "Amount must be higher than 0 when you transfer funds",
  },
});

export const refundSavebarMessages = defineMessages({
  saveDraft: {
    defaultMessage: "Save draft",
    id: "q7v0W7",
    description: "save draft button",
  },
  transferFunds: {
    defaultMessage: "Transfer funds",
    id: "Kfuqfq",
    description: "transfer funds button",
  },
  cancel: {
    defaultMessage: "Back",
    id: "PNq9W/",
    description: "back button",
  },
});

export const refundStatusMessages = defineMessages({
  success: {
    defaultMessage: "Success",
    id: "cohh4s",
    description: "Refund success status",
  },
  failure: {
    defaultMessage: "Failure",
    id: "MzXBdd",
    description: "Refund failure status",
  },
  pending: {
    defaultMessage: "Pending",
    id: "XFErUZ",
    description: "Refund pending status",
  },
  draft: {
    defaultMessage: "Draft",
    id: "PvrceS",
    description: "Refund draft status",
  },
});
