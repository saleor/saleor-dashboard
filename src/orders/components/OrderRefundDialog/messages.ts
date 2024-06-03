import { defineMessages } from "react-intl";

export const orderRefundDialogMesages = defineMessages({
  title: {
    id: "65j8ft",
    defaultMessage: "Create new refund",
    description: "dialog title",
  },
  subtitle: {
    id: "Y0NwOq",
    defaultMessage: "Select refund method:",
    description: "dialog subtitle",
  },
  standardRefundTitle: {
    id: "cN8pa0",
    defaultMessage: "Refund with line items",
    description: "radio button label",
  },
  standardRefundSubtitle: {
    id: "QX0gQb",
    defaultMessage:
      "Use the product list to suggest refund amount. Ideal for refunding specific items or entire order.",
    description: "radio button label",
  },
  manualRefundTitle: {
    id: "RK6l3Z",
    defaultMessage: "Refund with manual amount",
    description: "radio button label",
  },
  manualRefundSubtitle: {
    id: "VyC+Bm",
    defaultMessage:
      "Enter the refund amount without using the product list. Best for overcharges and custom adjustments.",
    description: "radio button label",
  },
  cannotCreateManual: {
    id: "M6mWHL",
    defaultMessage: "You do not have permissions to create a manual refund.",
    description: "tooltip helper text",
  },
});
