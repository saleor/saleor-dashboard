import { defineMessages } from "react-intl";

export const messages = defineMessages({
  panelTitle: {
    id: "FoWZeK",
    defaultMessage: "Shipments for {productName}",
  },
  noShipments: {
    id: "BINR5M",
    defaultMessage: "No shipments or returns recorded for this line yet.",
  },
  quantity: {
    id: "I/7E/4",
    defaultMessage: "{quantity, plural, one {# unit} other {# units}}",
  },
  grantedRefund: {
    id: "rRpH07",
    defaultMessage: "Transaction refund: {quantity, plural, one {# unit} other {# units}}",
  },
  cancelFulfillment: {
    id: "y8hdd1",
    defaultMessage: "Cancel fulfillment",
    description: "cancel fulfillment action in shipment row menu",
  },
});
