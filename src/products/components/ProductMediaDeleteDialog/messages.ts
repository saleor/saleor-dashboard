import { defineMessages } from "react-intl";

export const productMediaDeleteDialogMessages = defineMessages({
  deleteImageTitle: {
    id: "uCn/rd",
    defaultMessage: "Delete Image",
    description: "dialog header",
  },
  deleteVideoTitle: {
    id: "dGlDp6",
    defaultMessage: "Delete Video",
    description: "product media delete dialog header",
  },
  deleteMediaTitle: {
    id: "ECnjbS",
    defaultMessage: "Delete Media",
    description: "product media bulk delete dialog header",
  },
  deleteImageConfirmation: {
    id: "VEext+",
    defaultMessage: "Are you sure you want to delete this image?",
  },
  deleteVideoConfirmation: {
    id: "/uu/aV",
    defaultMessage: "Are you sure you want to delete this video?",
    description: "product media delete dialog content",
  },
  deleteMediaConfirmation: {
    id: "8XSZSL",
    defaultMessage:
      "{counter,plural,one{Are you sure you want to delete this media item?} other{Are you sure you want to delete {displayQuantity} media items?}}",
    description: "product media bulk delete dialog content",
  },
});
