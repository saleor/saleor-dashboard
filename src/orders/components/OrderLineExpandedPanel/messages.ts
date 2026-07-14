import { defineMessages } from "react-intl";

export const messages = defineMessages({
  panelTitle: {
    id: "oUxBlO",
    defaultMessage: "Line details for {productName}",
  },
  shipmentsSection: {
    id: "0iF2NT",
    defaultMessage: "Shipments",
    description: "physical shipment section header in line expanded panel",
  },
  transactionRefundsSection: {
    id: "R8R2lk",
    defaultMessage: "Transaction refunds",
    description: "transaction refund section header in line expanded panel",
  },
  noActivity: {
    id: "u7flSd",
    defaultMessage: "No shipments or transaction refunds recorded for this line yet.",
  },
  quantity: {
    id: "I/7E/4",
    defaultMessage: "{quantity, plural, one {# unit} other {# units}}",
  },
  grantedRefund: {
    id: "KYtsk7",
    defaultMessage: "Transaction refund",
    description: "transaction refund card label in line expanded panel",
  },
  refundAmount: {
    id: "yMjwop",
    defaultMessage: "Refund total {amount}",
    description: "granted refund amount in line expanded panel",
  },
  refundIncludesShipping: {
    id: "LBu3Q2",
    defaultMessage: "(incl. shipping)",
    description: "note when granted refund amount includes shipping costs",
  },
  editRefund: {
    id: "xErmO2",
    defaultMessage: "Edit & transfer",
    description: "open granted refund editor from line expanded panel",
  },
  cancelFulfillment: {
    id: "y8hdd1",
    defaultMessage: "Cancel fulfillment",
    description: "cancel fulfillment action in shipment row menu",
  },
  refundedAmount: {
    id: "kThWsq",
    defaultMessage: "Refunded {amount}",
    description: "fulfillment refund amount in expanded shipment row",
  },
  fulfillmentMetadata: {
    id: "Sbz/xB",
    defaultMessage: "View fulfillment metadata",
    description: "open fulfillment metadata from line expanded panel",
  },
  showCanceledShipments: {
    id: "xWtZEw",
    defaultMessage: "Show {count, plural, one {# canceled shipment} other {# canceled shipments}}",
    description: "expand canceled shipments in line expanded panel",
  },
  hideCanceledShipments: {
    id: "kHU+p8",
    defaultMessage: "Hide canceled shipments",
    description: "collapse canceled shipments in line expanded panel",
  },
});
