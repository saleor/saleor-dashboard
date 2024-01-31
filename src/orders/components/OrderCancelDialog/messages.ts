import { defineMessages } from "react-intl";

export const orderCancelDialogMessages = defineMessages({
  title: {
    id: "vbD1Zm",
    defaultMessage: "Cancel order {orderNumber}",
    description: "dialog title",
  },
  description: {
    id: "/K7his",
    defaultMessage:
      "<b>Important:</b> Refunds need to be issued <b>manually</b> after order cancelation.",
    description: "dialog description",
  },
  buttonKeep: {
    id: "P/aj+H",
    defaultMessage: "Keep order",
    description: "keep order button",
  },
  buttonCancel: {
    id: "qx/RBb",
    defaultMessage: "Cancel order",
    description: "cancel order button",
  },
});
