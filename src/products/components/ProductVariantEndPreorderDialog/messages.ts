import { defineMessages } from "react-intl";

export const productVariantEndPreorderDialogMessages = defineMessages({
  dialogTitle: {
    id: "Y4cy0i",
    defaultMessage: "Ending preorder",
    description: "dialog header",
  },
  dialogMessage: {
    id: "dTCWqt",
    defaultMessage:
      "You are about to end your products preorder. You have sold {variantGlobalSoldUnits} units of this variant. Sold units will be allocated at appropriate warehouses. Remember to add remaining threshold stock to warehouses.",
  },
  dialogConfirmButtonLabel: {
    id: "XMvH/d",
    defaultMessage: "ACCEPT",
    description: "button label",
  },
});
