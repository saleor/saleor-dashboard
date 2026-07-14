import { defineMessages } from "react-intl";

export const orderDraftBulkDeleteDialogMessages = defineMessages({
  title: {
    id: "qbmeUI",
    defaultMessage: "Delete Order Drafts",
    description: "dialog header",
  },
  subtitle: {
    id: "Q6VRrE",
    defaultMessage:
      "{counter,plural,one{Are you sure you want to delete this order draft?} other{Are you sure you want to delete {displayQuantity} order drafts?}}",
    description: "dialog content",
  },
});
