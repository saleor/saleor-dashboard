import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql/transactions";
import currency from "currency.js";

import { GrantRefundState } from "./reducer";

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
