import { defineMessages } from "react-intl";

export const submitCardMessages = defineMessages({
  cardTitle: {
    defaultMessage: "Return & Replace",
    id: "Z3T6zR",
    description: "card title",
  },
  descrption: {
    defaultMessage:
      "Draft order will be automatically created for replaced products",
    id: "ZTG+Dv",
  },
  autoGrantRefund: {
    defaultMessage: "Grant refund for returned items",
    id: "d1PvC8",
    description: "checkbox",
  },
  autoSendRefund: {
    defaultMessage: "Automatically send granted refund",
    id: "h0IgEq",
    description: "checkbox",
  },
  refundShipment: {
    defaultMessage: "Refund shipment: {currency} {amount}",
    id: "lXq4EE",
    description: "checkbox",
  },
  submitButton: {
    defaultMessage: "Return and Replace products",
    id: "uN88fb",
    description: "button, submit form",
  },
});
