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
  mediaReorderSuccess: {
    id: "JV3DcT",
    defaultMessage: "Media order updated",
    description: "success notification when product media gallery order is saved",
  },
  mediaUploadSuccess: {
    id: "bqSNm/",
    defaultMessage: "Image added",
    description: "success notification when product media is uploaded",
  },
  deleteMediaImageTitle: {
    id: "uCn/rd",
    defaultMessage: "Delete Image",
    description: "dialog header",
  },
  deleteMediaVideoTitle: {
    id: "dGlDp6",
    defaultMessage: "Delete Video",
    description: "product media delete dialog header",
  },
  deleteMediaImageConfirmation: {
    id: "VEext+",
    defaultMessage: "Are you sure you want to delete this image?",
  },
  deleteMediaVideoConfirmation: {
    id: "/uu/aV",
    defaultMessage: "Are you sure you want to delete this video?",
    description: "product media delete dialog content",
  },
});
