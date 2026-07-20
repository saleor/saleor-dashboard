import { defineMessages } from "react-intl";

export const productUpdatePageMessages = defineMessages({
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
  mediaUploadSuccessCount: {
    id: "Yxoq3Y",
    defaultMessage: "{count, plural, one {# image added} other {# images added}}",
    description: "success notification when one or more product images finish uploading",
  },
  mediaUploadAllFailed: {
    id: "2z3+WY",
    defaultMessage:
      "{count, plural, one {Failed to upload image} other {Failed to upload # images}}",
    description: "error notification when all product image uploads in a batch failed",
  },
  mediaUploadPartial: {
    id: "lxP7Rb",
    defaultMessage:
      "{success, plural, one {# image} other {# images}} added, {failed, plural, one {# failed} other {# failed}}",
    description: "warning notification when some product image uploads in a batch failed",
  },
  mediaDeleteSuccess: {
    id: "F2xa5K",
    defaultMessage: "{counter,plural,one{Media deleted} other{# media items deleted}}",
    description: "success notification when product media items are deleted",
  },
});
