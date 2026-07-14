import { defineMessages } from "react-intl";

export const orderDraftCancelDialogMessages = defineMessages({
  dialogTitle: {
    id: "Yk0avO",
    defaultMessage: "Delete Draft Order",
    description: "dialog header",
  },
  dialogContent: {
    id: "aHasbu",
    defaultMessage: "Are you sure you want to delete draft <b>{orderNumber}</b>?",
    description: "delete draft order confirmation",
  },
  buttonKeepDraft: {
    id: "uU1mx5",
    defaultMessage: "Keep draft",
    description: "button to keep draft order",
  },
});
