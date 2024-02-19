import { defineMessages } from "react-intl";

export const cancelOrderDialogMessages = defineMessages({
  dialogTitle: {
    id: "wmeRVH",
    defaultMessage: "Cancel order #{orderNumber}",
    description: "dialog header",
  },
  dialogContent: {
    id: "NWA+MK",
    defaultMessage:
      "<b>Important:</b> Refunds need to be issued <b>manually</b> after order cancelation.",
    description: "dialog content",
  },
  buttonKeepOrder: {
    id: "p6ugX0",
    defaultMessage: "Keep order",
    description: "button to keep order",
  },
  buttonCancelOrder: {
    id: "bKTEnb",
    defaultMessage: "Cancel order",
    description: "button to cancel order",
  },
});
