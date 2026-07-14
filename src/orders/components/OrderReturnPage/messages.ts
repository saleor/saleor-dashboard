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
    id: "rFPJmR",
    defaultMessage:
      "Opened from the line matrix for {productName}. Quantities are prefilled for this line — adjust before submitting.",
    description: "inline hint when return page is opened with lineId",
  },
  showAllLines: {
    id: "pxCn3q",
    defaultMessage: "Show all lines",
    description: "button to clear lineId filter on return page",
  },
});
