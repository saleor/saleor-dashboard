import { defineMessages } from "react-intl";

export const orderReturnMessages = defineMessages({
  appTitle: {
    id: "rVIlBs",
    defaultMessage: "Order #{orderNumber}",
    description: "page header with order number",
  },
  pageTitle: {
    id: "rH4pi3",
    defaultMessage: "Return & replace products",
    description: "page header",
  },
  prefilledLineHint: {
    id: "lzE5k8",
    defaultMessage:
      "Opened from the line matrix for {productName}. Quantities are prefilled — adjust before submitting.",
    description: "hint when return page opened from line matrix with lineId",
  },
});
