import {
  OrderDetailsGrantedRefundFragment,
  OrderDetailsGrantRefundFragment,
  OrderGrantedRefundFragment,
  OrderGrantRefundCreateLineInput,
} from "@dashboard/graphql";
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
  Array.from(lines.entries())
    .filter(([_, line]) => line.isDirty)
    .map(([, line]) => ({
      id: line.orderLineId,
      quantity: line.selectedQuantity,
    }));

export const getLineAvailableQuantity = ({
  lineId,
  lineQuntity,
  grantRefunds,
  grantRefundId,
}: {
  lineId: string;
  lineQuntity: number;
  grantRefunds: OrderDetailsGrantRefundFragment["grantedRefunds"];
  grantRefundId?: string;
}) => {
  let refundedQuantity = 0;

  grantRefunds.forEach(refund => {
    if (grantRefundId && refund.id === grantRefundId) {
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

export interface OrderGrantRefundData {
  amount: number;
  reason: string;
  lines: OrderGrantRefundCreateLineInput[];
  grantRefundForShipping: boolean;
  grantRefundId: string;
}

export const getGrantedRefundData = (
  grantedRefund?: OrderDetailsGrantedRefundFragment,
): OrderGrantRefundData | undefined => {
  if (!grantedRefund) {
    return undefined;
  }

  return {
    grantRefundId: grantedRefund.id,
    reason: grantedRefund?.reason ?? "",
    amount: grantedRefund.amount.amount,
    grantRefundForShipping: grantedRefund.shippingCostsIncluded,
    lines: grantedRefund?.lines ?? [],
  };
};

export const calculateCanRefundShipping = (
  editedGrantedRefund?: OrderGrantRefundData,
  grantedRefunds?: Array<Pick<OrderGrantedRefundFragment, "id" | "shippingCostsIncluded">>,
) => {
  if (editedGrantedRefund) {
    if (editedGrantedRefund.grantRefundForShipping) {
      return true;
    }

    return !grantedRefunds?.some(
      refund => refund.shippingCostsIncluded && refund.id !== editedGrantedRefund.grantRefundId,
    );
  }

  return !grantedRefunds?.some(refund => refund.shippingCostsIncluded);
};

export const getRefundAmountValue = ({
  isAmountInputDirty,
  isEditedRefundAmount,
  totalCalulatedPrice,
  refundAmount,
}: {
  isAmountInputDirty: boolean;
  totalCalulatedPrice: number;
  refundAmount: number;
  isEditedRefundAmount: boolean;
}) => {
  // User provided value into input or we are editing refund amount
  if (isAmountInputDirty || isEditedRefundAmount) {
    return refundAmount;
  }

  return totalCalulatedPrice ?? 0;
};
