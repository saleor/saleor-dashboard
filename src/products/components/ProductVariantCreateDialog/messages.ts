import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    defaultMessage: "Create Variants",
    description: "dialog header"
  },
  description: {
    defaultMessage: "How would you like to create variants:",
    description: "create product variants"
  },
  optionMultipleTitle: {
    defaultMessage: "Create multiple variant via variant creator",
    description: "option"
  },
  optionMultipleDescription: {
    defaultMessage:
      "Use variant creator to create matrix of selected attribute values to create variants",
    description: "option description"
  },
  optionSingleTitle: {
    defaultMessage: "Create single variant",
    description: "option"
  },
  optionSingleDescription: {
    defaultMessage: "Create new variant using variant details view",
    description: "option description"
  }
});
