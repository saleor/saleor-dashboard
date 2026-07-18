import { defineMessages } from "react-intl";

export const messages = defineMessages({
  media: {
    id: "/Mcvt4",
    defaultMessage: "Media",
    description: "section header",
  },
  upload: {
    id: "mGiA6q",
    defaultMessage: "Upload",
    description: "modal button upload",
  },
  uploadImages: {
    id: "9CEu8k",
    defaultMessage: "Upload Images",
    description: "modal button images upload",
  },
  uploadUrl: {
    id: "Q2UXlW",
    defaultMessage: "Upload URL",
    description: "modal button url upload",
  },
  uploadHint: {
    id: "/jEC3m",
    defaultMessage: "Drag and drop or click to upload",
    description: "product media gallery dropzone hint",
  },
  uploadHintDrop: {
    id: "KXX8oX",
    defaultMessage: "Drag and drop to upload",
    description: "product media gallery dropzone hint when click-to-upload is disabled",
  },
  deleteSelected: {
    id: "SRnxlw",
    defaultMessage: "Delete ({quantity})",
    description: "button to delete selected product media items",
  },
  selectAll: {
    id: "C87+/n",
    defaultMessage: "Select all",
    description: "button to select all product media items",
  },
  clearSelection: {
    id: "I7X2uK",
    defaultMessage: "Clear",
    description: "button to clear selected product media items",
  },
  uploadRejected: {
    id: "LzdG4r",
    defaultMessage:
      "{count, plural, one {# file was skipped} other {# files were skipped}} (not an image or larger than {maxSize} MB)",
    description: "warning when client-side validation rejects product media files before upload",
  },
});
