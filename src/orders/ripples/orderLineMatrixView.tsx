import { type Ripple } from "@dashboard/ripples/types";
import { Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

const orderLineMatrixViewContextual = (
  <Text>
    <FormattedMessage
      id="Oco9gj"
      defaultMessage="See every line's fulfillment and refund progress in one place. Switch to "
    />
    <em>
      <FormattedMessage id="zWkvNO" defaultMessage="Timeline" />
    </em>{" "}
    <FormattedMessage id="cCPJrM" defaultMessage="when you want the shipment-by-shipment view." />
  </Text>
);

const orderLineMatrixViewGlobal = (
  <Text color="default2">
    <FormattedMessage id="o+YgVe" defaultMessage="Order details now open in " />
    <em>
      <FormattedMessage id="igoIjo" defaultMessage="Line matrix" />
    </em>
    <FormattedMessage id="nMG9yW" defaultMessage=" so you can work order line by order line." />{" "}
    <em>
      <FormattedMessage id="zWkvNO" defaultMessage="Timeline" />
    </em>
    <FormattedMessage
      id="YKnqA+"
      defaultMessage=" is still available when you need to follow shipments."
    />
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
