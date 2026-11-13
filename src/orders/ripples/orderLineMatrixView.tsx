import { messages as itemsSectionMessages } from "@dashboard/orders/components/OrderDetailsItemsSection/messages";
import { type Ripple } from "@dashboard/ripples/types";
import { Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

const timeline = (
  <em>
    <FormattedMessage {...itemsSectionMessages.timeline} />
  </em>
);

const orderLineMatrixViewContextual = (
  <Text>
    <FormattedMessage
      id="YiLjXa"
      defaultMessage="See every line's fulfillment and refund progress in one place. Switch to {timeline} when you want the shipment-by-shipment view."
      values={{ timeline }}
    />
  </Text>
);

const orderLineMatrixViewGlobal = (
  <Text color="default2">
    <FormattedMessage
      id="G/+bM3"
      defaultMessage="Order details now open in {lineMatrix} so you can work order line by order line. {timeline} is still available when you need to follow shipments."
      values={{
        lineMatrix: (
          <em>
            <FormattedMessage {...itemsSectionMessages.lineMatrix} />
          </em>
        ),
        timeline,
      }}
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
