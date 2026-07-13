import { type Ripple } from "@dashboard/ripples/types";
import { Text } from "@saleor/macaw-ui-next";

const orderLineMatrixViewContextual = (
  <Text>
    See every line&apos;s fulfillment and refund progress in one place. Switch to <em>Timeline</em>{" "}
    when you want the shipment-by-shipment view.
  </Text>
);

const orderLineMatrixViewGlobal = (
  <Text color="default2">
    Order details now open in <em>Line matrix</em> so you can work order line by order line.{" "}
    <em>Timeline</em> is still available when you need to follow shipments. Use{" "}
    <em>Needs action</em> to focus on lines that still need approval or refund follow-up.
  </Text>
);

export const rippleOrderLineMatrixView: Ripple = {
  type: "feature",
  ID: "order-line-matrix-default-view",
  TTL_seconds: 60 * 60 * 24 * 14,
  dateAdded: new Date(2026, 6, 13),
  content: {
    oneLiner: "Work order lines in one view",
    contextual: orderLineMatrixViewContextual,
    global: orderLineMatrixViewGlobal,
  },
};
