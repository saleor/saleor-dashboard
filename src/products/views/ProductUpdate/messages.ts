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
  variantBulkCreateAllFailed: {
    id: "4sYqlg",
    defaultMessage: "All variants failed to create",
    description: "error message when bulk variant creation fails completely",
  },
  variantBulkCreateSuccess: {
    id: "bRQeJp",
    defaultMessage:
      "{count, plural, one {# variant created successfully} other {# variants created successfully}}",
    description: "success message when all variants are created",
  },
  variantBulkCreatePartial: {
    id: "u6rPuc",
    defaultMessage:
      "{success, plural, one {# variant} other {# variants}} created, {failed, plural, one {# failed} other {# failed}}",
    description: "warning message when some variants failed to create",
  },
});
