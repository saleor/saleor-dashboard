import { defineMessages } from "react-intl";

export const orderCannotCancelOrderDialogMessages = defineMessages({
  title: {
    id: "NhQboB",
    defaultMessage: "Saleor couldn’t cancel order",
    description: "dialog header",
  },
  description: {
    id: "66ZnLi",
    defaultMessage:
      "There are still fulfillments created for this order. Cancel the fulfillments first before you cancel the order.",
    description: "cannot cancel order dialog explanation",
  },
});
