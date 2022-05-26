import { defineMessages } from "react-intl";

export const stockExceededDialogMessages = defineMessages({
  title: {
    defaultMessage: "Not enough stock",
    id: "qZHHed",
    description: "stock exceeded dialog title",
  },
  infoLabel: {
    defaultMessage:
      "Stock for items shown below are not enough to prepare fulfillment:",
    id: "Z7Tf8e",
    description: "stock exceeded dialog description",
  },
  questionLabel: {
    defaultMessage: "Are you sure you want to fulfill those products anyway?",
    id: "S7Rwl0",
    description: "stock exceeded action question label",
  },
  cancelButton: {
    defaultMessage: "Cancel",
    id: "uT5L4h",
    description: "cancel button label",
  },
  fulfillButton: {
    defaultMessage: "Fulfill anyway",
    id: "VSj89H",
    description: "fulfill button label",
  },
  productLabel: {
    defaultMessage: "Product",
    id: "74Cxe8",
    description: "table header product label",
  },
  requiredStockLabel: {
    defaultMessage: "Required",
    id: "TZtvTG",
    description: "table header required stock label",
  },
  availableStockLabel: {
    defaultMessage: "Available",
    id: "JMBsrr",
    description: "table header available stock label",
  },
  warehouseStockLabel: {
    defaultMessage: "Warehouse stock",
    id: "Mmo9k2",
    description: "table header warehouse stock label",
  },
});
