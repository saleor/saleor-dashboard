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
  viewModeAriaLabel: {
    id: "BL0Yro",
    defaultMessage: "Order items view",
    description: "aria label for timeline vs line matrix switch",
  },
  matrixHelper: {
    id: "oB4Eq3",
    defaultMessage:
      "Quantities show fulfillment status per unit. Click a line's status to manage shipments.",
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
