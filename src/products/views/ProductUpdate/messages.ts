import { defineMessages } from "react-intl";

export const productUpdatePageMessages = defineMessages({
  deleteProductDialogTitle: {
    id: "TWVx7O",
    defaultMessage: "Delete Product",
    description: "delete product dialog title",
  },
  deleteProductDialogSubtitle: {
    id: "ZHF4Z9",
    defaultMessage: "Are you sure you want to delete {name}?",
    description: "delete product dialog subtitle",
  },
  deleteVariantDialogTitle: {
    id: "6iw4VR",
    defaultMessage: "Delete Product Variants",
    description: "delete variant dialog title",
  },
  deleteVariantDialogSubtitle: {
    id: "ukdRUv",
    defaultMessage:
      "{counter,plural,one{Are you sure you want to delete this variant?} other{Are you sure you want to delete {displayQuantity} variants?}}",
    description: "delete variant dialog subtitle",
  },
});
