import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import currency from "currency.js";

import { Line } from "./form";
import { GrantRefundState, ReducerOrderLine } from "./reducer";

export const calculateTotalPrice = (
  state: GrantRefundState,
  order: OrderDetailsGrantRefundFragment,
): number => {
  const shippingCost = order?.shippingPrice?.gross?.amount ?? 0;
  const lines = Array.from(state.lines.values());

  const linesValue = lines.reduce((total, line) => {
    const price = currency(line.unitPrice).multiply(line.selectedQuantity);
    return total.add(price.value);
  }, currency(0));

  if (state.refundShipping) {
    return linesValue.add(currency(shippingCost)).value;
  }

  return linesValue.value;
};

export const getFulfilmentSubtitle = (
  order: OrderDetailsGrantRefundFragment,
  fulfillment: OrderDetailsGrantRefundFragment["fulfillments"][0],
) => `#${order.number}-${fulfillment.fulfillmentOrder}`;

export const prepareLineData = (lines: Map<string, ReducerOrderLine>): Line[] =>
  Array.from(lines.entries()).map(([id, line]) => ({
    id,
    quantity: line.selectedQuantity,
  }));

export const getLineAvailableQuantity = (
  lineId: string,
  lineQuntity: number,
  grantRefunds: OrderDetailsGrantRefundFragment["grantedRefunds"],
  grandRefundId?: string,
) => {
  let refundedQuantity = 0;

  grantRefunds.forEach(refund => {
    if (grandRefundId && refund.id === grandRefundId) {
      return;
    }

    refund?.lines?.forEach(line => {
      if (line.orderLine.id === lineId) {
        refundedQuantity += line.quantity;
      }
    });
  });

  return lineQuntity - refundedQuantity;
};
