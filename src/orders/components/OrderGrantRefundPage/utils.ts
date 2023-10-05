import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import currency from "currency.js";
import diff from "lodash/difference";

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

export const filterLinesByNotYetRefunded = (
  lines: OrderDetailsGrantRefundFragment["fulfillments"][0]["lines"],
  grantedRefunds: OrderDetailsGrantRefundFragment["grantedRefunds"],
) => {
  const grantedRefundLines = grantedRefunds
    .map(grantedRefund => grantedRefund.lines)
    .flat()
    .filter(Boolean)
    .map(line => line!.orderLine.id);

  return lines?.filter(line => {
    if (!line?.orderLine) return false;

    return !grantedRefundLines.includes(line.orderLine.id);
  });
};
