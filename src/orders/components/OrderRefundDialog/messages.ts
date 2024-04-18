import { defineMessages } from "react-intl";

export const orderRefundDialogMesages = defineMessages({
  title: {
    id: "jIVn80",
    defaultMessage: "Create a new refund",
    description: "dialog title",
  },
  subtitle: {
    id: "O+w1k0",
    defaultMessage: "How do you want to make a refund?",
    description: "dialog subtitle",
  },
  standardRefundTitle: {
    id: "cN8pa0",
    defaultMessage: "Refund with line items",
    description: "radio button label",
  },
  standardRefundSubtitle: {
    id: "+6liDh",
    defaultMessage: "The purchased product list will be sent and used to suggest amount to refund.",
    description: "radio button label",
  },
  miscRefundTitle: {
    id: "RK6l3Z",
    defaultMessage: "Refund with manual amount",
    description: "radio button label",
  },
  miscRefundSubtitle: {
    id: "DAgLzp",
    defaultMessage:
      "Do not use information about the products and rely on amount provided manually.",
    description: "radio button label",
  },
});
