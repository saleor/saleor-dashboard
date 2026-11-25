import { type Ripple } from "@dashboard/ripples/types";
import { Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { defineMessages, FormattedMessage } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "SYtvEw",
    defaultMessage: "Work order lines in one view",
    description: "ripple title",
  },
  contextual: {
    id: "aLYGzu",
    defaultMessage:
      "See every line's fulfillment and refund progress in one place. Switch to <em>Timeline</em> when you want the shipment-by-shipment view.",
    description: "ripple contextual hint",
  },
  global: {
    id: "ZQDpZj",
    defaultMessage:
      "Order details now open in <em>Line matrix</em> so you can work order line by order line. <em>Timeline</em> is still available when you need to follow shipments.",
    description: "ripple description in What's New",
  },
});

const emphasis = { em: (chunks: ReactNode[]) => <em>{chunks}</em> };

const orderLineMatrixViewContextual = (
  <Text>
    <FormattedMessage {...contentMessages.contextual} values={emphasis} />
  </Text>
);

const orderLineMatrixViewGlobal = (
  <Text color="default2">
    <FormattedMessage {...contentMessages.global} values={emphasis} />
  </Text>
);

export const rippleOrderLineMatrixView: Ripple = {
  type: "feature",
  ID: "order-line-matrix-default-view",
  TTL_seconds: 60 * 60 * 24 * 14,
  dateAdded: new Date(2026, 6, 13),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: orderLineMatrixViewContextual,
    global: orderLineMatrixViewGlobal,
  },
};
