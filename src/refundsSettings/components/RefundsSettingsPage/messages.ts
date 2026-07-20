import { defineMessages } from "react-intl";

export const refundsSettingsPageMessages = defineMessages({
  pageTitle: {
    defaultMessage: "Refunds & returns settings",
    id: "CCjH3M",
  },
  // Refund section
  refundExplainerTitle: {
    defaultMessage: "Refund reasons",
    id: "QpYazu",
  },
  refundExplainerContent: {
    defaultMessage:
      "Select a Model Type. All Models extending the type will be available as refund reasons when issuing a refund.",
    id: "uGqPKY",
  },
  refundSelectLabel: {
    defaultMessage: "Refunds Model Type",
    id: "e71euF",
  },
  refundSelectHelper: {
    defaultMessage: "Choose the Model Type whose extended Models will serve as refund reasons.",
    id: "pepgIN",
  },
  refundPreviewTitle: {
    defaultMessage: "Current refund reasons from",
    id: "VSLrmT",
  },
  // Return section
  returnExplainerTitle: {
    defaultMessage: "Return reasons",
    id: "ilTOqQ",
  },
  returnExplainerContent: {
    defaultMessage:
      "Select a Model Type. All Models extending the type will be available as return reasons when returning products.",
    id: "wAgQU+",
  },
  returnSelectLabel: {
    defaultMessage: "Returns Model Type",
    id: "4Za2EN",
  },
  returnSelectHelper: {
    defaultMessage: "Choose the Model Type whose extended Models will serve as return reasons.",
    id: "Jk7dD2",
  },
  returnPreviewTitle: {
    defaultMessage: "Current return reasons from",
    id: "y7/amd",
  },
  // Shared
  noneOption: {
    defaultMessage: "Disabled",
    id: "tthToS",
  },
  createModelTypeLink: {
    defaultMessage: "Create new Model Type",
    id: "4Rj36Y",
  },
  emptyModels: {
    defaultMessage: "This Model Type does not have created models yet.",
    id: "qZB1cn",
  },
  createModelLink: {
    defaultMessage: "Create a Model",
    id: "6J1m2c",
  },
  pageDescription: {
    id: "OZ5c64",
    defaultMessage:
      "Choose Model Types whose instances appear as structured refund and return reasons on orders.",
    description: "intro under refunds and returns settings page title",
  },
  saveSuccess: {
    id: "J5+lYc",
    defaultMessage: "Refunds and returns settings updated",
    description: "success notification after saving refunds settings hub",
  },
});
