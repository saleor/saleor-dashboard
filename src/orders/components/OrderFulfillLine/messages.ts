import { defineMessages } from "react-intl";

export const messages = defineMessages({
  preorderWarning: {
    defaultMessage:
      "This product is still in preorder. You will be able to fulfill it after it reaches it’s release date",
    id: "k6sfZr",
    description: "tooltip content when product is in preorder",
  },
  deletedVariantWarning: {
    defaultMessage: "This variant no longer exists. You can still fulfill it.",
    id: "8vQGO0",
    description: "tooltip content when line's variant has been deleted",
  },
});
