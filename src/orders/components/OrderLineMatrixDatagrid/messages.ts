import { defineMessages } from "react-intl";

export const messages = defineMessages({
  status: {
    id: "tzMNF3",
    defaultMessage: "Status",
  },
  pendingApproval: {
    id: "/CaREm",
    defaultMessage: "Pending approval",
  },
  product: {
    id: "x/ZVlU",
    defaultMessage: "Product",
  },
  sku: {
    id: "k4brJy",
    defaultMessage: "SKU",
  },
  variantName: {
    id: "OK5+Fh",
    defaultMessage: "Variant",
  },
  ordered: {
    id: "PWTzkQ",
    defaultMessage: "Ordered",
  },
  allocated: {
    id: "+dDyb1",
    defaultMessage: "Allocated",
  },
  toFulfill: {
    id: "oUM6fi",
    defaultMessage: "To fulfill",
  },
  shipped: {
    id: "OtIOMb",
    defaultMessage: "Shipped",
  },
  returned: {
    id: "wm96Jx",
    defaultMessage: "Returned",
  },
  refunded: {
    id: "fZTOwM",
    defaultMessage: "Fulfillment refund",
    description: "quantity refunded via fulfillment records in line matrix",
  },
  refundedTooltip: {
    id: "pV9VOI",
    defaultMessage:
      "Units refunded through fulfillment records. Amount is estimated from the line unit price.",
    description: "fulfillment refund column tooltip in line matrix",
  },
  grantedRefund: {
    id: "5oaFMX",
    defaultMessage: "Transaction refund",
    description: "granted transaction refund quantity in line matrix",
  },
  grantedRefundTooltip: {
    id: "Piivpc",
    defaultMessage: "Units and amount covered by granted transaction refunds for this line.",
    description: "transaction refund column tooltip in line matrix",
  },
  statusColumnTooltip: {
    id: "7az76v",
    defaultMessage: "Click to view shipments and refunds for this line.",
    description: "tooltip for status column in line matrix",
  },
  price: {
    id: "ITSq4J",
    defaultMessage: "Unit price",
  },
  total: {
    id: "MJ2jZQ",
    defaultMessage: "Total",
  },
  productDetails: {
    id: "VYK2nN",
    defaultMessage: "Product details",
  },
  returnLine: {
    id: "nHOEZP",
    defaultMessage: "Return this line",
    description: "return a single order line from matrix row menu",
  },
  refundLine: {
    id: "yiJ6EO",
    defaultMessage: "Refund this line",
    description: "refund a single order line from matrix row menu",
  },
  fulfillLine: {
    id: "5YW/f6",
    defaultMessage: "Fulfill this line",
    description: "fulfill a single order line from matrix row menu",
  },
  replaced: {
    id: "T7Dju4",
    defaultMessage: "Replaced",
    description: "replaced quantity column in line matrix",
  },
  showMetadata: {
    id: "E/yzIO",
    defaultMessage: "View metadata",
  },
  needsAction: {
    id: "GTiyDh",
    defaultMessage: "Needs action",
    description: "filter matrix rows that need merchant attention",
  },
  needsActionFilterAriaLabel: {
    id: "UZjdjP",
    defaultMessage: "Highlight lines that need action",
    description: "aria label for needs action toggle above line matrix",
  },
  needsActionHelpTitle: {
    id: "t53iRo",
    defaultMessage: "Needs action",
    description: "title for needs action filter help tooltip",
  },
  needsActionHelpHighlightedLabel: {
    id: "xXlmYh",
    defaultMessage: "Highlighted lines",
    description: "section label for lines included in needs action filter",
  },
  needsActionHelpPendingApproval: {
    id: "1g1Hsn",
    defaultMessage: "Pending shipment approval",
    description: "needs action help bullet for pending approval",
  },
  needsActionHelpDraftRefund: {
    id: "tcioFM",
    defaultMessage: "Draft refunds not sent",
    description: "needs action help bullet for draft refunds",
  },
  needsActionHelpFailedRefund: {
    id: "34P9Lf",
    defaultMessage: "Failed refund transfers",
    description: "needs action help bullet for failed refunds",
  },
  needsActionHelpOtherLinesLabel: {
    id: "j9r+EY",
    defaultMessage: "Other lines",
    description: "section label for non-highlighted lines in needs action tooltip",
  },
  needsActionHelpOtherLinesBody: {
    id: "gpda9P",
    defaultMessage: "Stay visible in the list but appear faded.",
    description: "explains muted rows when needs action filter is on",
  },
});
