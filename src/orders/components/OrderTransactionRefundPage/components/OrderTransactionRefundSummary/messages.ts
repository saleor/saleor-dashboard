import { defineMessages } from "react-intl";

export const orderTransactionRefundSummaryMessages = defineMessages({
  amount: {
    defaultMessage: "Refund amount",
    id: "+IayD+",
    description: "order transaction refund summary title",
  },
  amountDescription: {
    defaultMessage:
      "The refund amount is calculated automatically based on the items selected. You can modify it manually if needed.",
    id: "f4oJRg",
    description: "order transaction refund summary description",
  },
  selectedProducts: {
    defaultMessage: "Selected products",
    id: "fDc5ys",
    description: "order transaction refund summary label",
  },
  shipping: {
    defaultMessage: "Shipping",
    id: "GuihaP",
    description: "order transaction refund summary label",
  },
  cannotRefundShipping: {
    defaultMessage: "Shipping has already been refunded.",
    id: "6ScZk5",
    description: "order transaction refund summary disabled shipping tooltip content",
  },
  totalAmount: {
    defaultMessage: "Total:",
    id: "XgsXQv",
    description: "order transaction refund summary label",
  },
});
