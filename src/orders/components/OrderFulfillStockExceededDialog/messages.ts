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
    defaultMessage: "Required stock",
    description: "table header required stock label"
  },
  availableStockLabel: {
    defaultMessage: "Selected warehouse",
    description: "table header selected warehouse label"
  }
});
