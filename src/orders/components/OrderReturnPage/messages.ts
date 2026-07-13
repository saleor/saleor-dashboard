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
    id: "jpxGC8",
    defaultMessage:
      "Returning {productName}. Quantities are prefilled for this line only — adjust amounts before submitting.",
    description: "hint when return page opened from line matrix with lineId",
  },
});
