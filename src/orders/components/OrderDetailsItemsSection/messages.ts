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
    id: "uPg2BK",
    defaultMessage:
      "Quantities show fulfillment status per unit. Click a line's status or row to manage shipments.",
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
  orderLevelRefundTitle: {
    id: "XExNls",
    defaultMessage:
      "{count, plural, one {# order-level refund needs attention} other {# order-level refunds need attention}}",
    description: "callout title for granted refunds not tied to a line",
  },
  orderLevelRefundBody: {
    id: "i4WCUJ",
    defaultMessage:
      "{amount} is not tied to a specific line{includesShipping, select, true { and includes shipping} other {}}.",
    description: "inline notice for order-level granted refunds in matrix view",
  },
  orderLevelRefundBodyMultiple: {
    id: "l3LUAN",
    defaultMessage: "They are not tied to specific order lines.",
    description: "inline notice when multiple order-level granted refunds need attention",
  },
  reviewOrderLevelRefund: {
    id: "dLvcnv",
    defaultMessage: "Review refund",
    description: "button to open order-level granted refund editor",
  },
});
