import { defineMessages } from "react-intl";

/** Shared by every media gallery (products, categories, collections, models). */
export const mediaMessages = defineMessages({
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
  // No description, so the id (and its existing translations) match the product media page.
  mediaUpdateSuccess: {
    id: "uOC/uQ",
    defaultMessage: "Image updated",
  },
});
