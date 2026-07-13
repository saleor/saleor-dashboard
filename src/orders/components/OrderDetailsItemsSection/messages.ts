import { defineMessages } from "react-intl";

export const messages = defineMessages({
  timeline: {
    id: "zWkvNO",
    defaultMessage: "Timeline",
  },
  lineMatrix: {
    id: "igoIjo",
    defaultMessage: "Line matrix",
  },
  matrixHelper: {
    id: "2wBJyQ",
    defaultMessage:
      "Quantities show where each unit is in the fulfillment lifecycle. Click a line's status to view and manage its shipments.",
  },
  fulfill: {
    id: "QDxJib",
    defaultMessage: "Fulfill",
  },
  returnOrder: {
    id: "0WJNP/",
    defaultMessage: "Return",
  },
  showCanceledShipments: {
    id: "MFPCsL",
    defaultMessage: "Show {count, plural, one {# canceled shipment} other {# canceled shipments}}",
    description: "expand canceled fulfillments in timeline view",
  },
  hideCanceledShipments: {
    id: "MB+UTU",
    defaultMessage: "Hide canceled shipments",
    description: "collapse canceled fulfillments in timeline view",
  },
  lineExpandedAnnouncement: {
    id: "sZ8CgC",
    defaultMessage: "Shipments expanded for {productName}",
    description: "screen reader announcement when matrix line is expanded",
  },
});
