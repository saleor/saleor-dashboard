import { defineMessages } from "react-intl";

export const stockExceededDialogMessages = defineMessages({
  title: {
    defaultMessage: "Not enough stock",
    description: "stock exceeded dialog title"
  },
  infoLabel: {
    defaultMessage:
      "Stock for items shown below are not enough to prepare fulfillment:",
    description: "stock exceeded dialog description"
  },
  questionLabel: {
    defaultMessage: "Are you sure you want to fulfill those products anyway?",
    description: "stock exceeded action question label"
  },
  cancelButton: {
    defaultMessage: "Cancel",
    description: "cancel button label"
  },
  fulfillButton: {
    defaultMessage: "Fulfill anyway",
    description: "fulfill button label"
  },
  productLabel: {
    defaultMessage: "Product",
    description: "table header product label"
  },
  requiredStockLabel: {
    defaultMessage: "Required",
    description: "table header required stock label"
  },
  availableStockLabel: {
    defaultMessage: "Available",
    description: "table header available stock label"
  },
  warehouseStockLabel: {
    defaultMessage: "Warehouse stock",
    description: "table header warehouse stock label"
  }
});
