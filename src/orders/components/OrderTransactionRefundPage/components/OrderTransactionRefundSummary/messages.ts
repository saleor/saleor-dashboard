import { defineMessages } from "react-intl";

export const orderTransactionRefundSummaryMessages = defineMessages({
  amount: {
    defaultMessage: "Amount",
    id: "OoMaRq",
    description: "order transaction refund summary title",
  },
  amountDescription: {
    defaultMessage:
      "Amount is calculated automatically based on the items selected, but you can modify it manually.",
    id: "a5D12C",
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
    description:
      "order transaction refund summary disabled shipping tooltip content",
  },
  totalAmount: {
    defaultMessage: "Total amount:",
    id: "cYkerh",
    description: "order transaction refund summary label",
  },
});
