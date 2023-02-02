import { OrderDetailsQuery, OrderDiscountType } from "@dashboard/graphql";
import { OrderDiscountCommonInput } from "@dashboard/orders/components/OrderDiscountCommonModal/types";
import { OrderBothTypes } from "@dashboard/orders/types";
import { useState } from "react";

import { OrderLineDiscountData } from "./types";

export const useDiscountDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const closeDialog = () => setIsDialogOpen(false);
  const openDialog = () => setIsDialogOpen(true);

  return { closeDialog, isDialogOpen, openDialog };
};
export const getManualOrderDiscount = (order: OrderBothTypes) =>
  order ? getOrderDiscount(order, OrderDiscountType.MANUAL) : null;

export const getOrderDiscount = (
  order: OrderBothTypes,
  discountType: OrderDiscountType,
): OrderDetailsQuery["order"]["discounts"][0] =>
  order.discounts.find(({ type }) => type === discountType);

export const getOrderLineDiscount = (
  order: OrderBothTypes,
  orderLineId: string,
): OrderLineDiscountData => {
  const {
    unitDiscount: moneyValue,
    unitDiscountReason: reason,
    unitDiscountValue: value,
    undiscountedUnitPrice: undiscountedPrice,
    unitDiscountType: calculationMode,
  } = order.lines.find(
    ({ id }: OrderDetailsQuery["order"]["lines"][0]) => id === orderLineId,
  );

  if (!value) {
    return null;
  }

  return {
    calculationMode,
    moneyValue,
    reason,
    undiscountedPrice,
    value,
  };
};

export const getParsedDiscountData = ({
  value,
  calculationMode,
  reason,
}: OrderDiscountCommonInput) => ({ reason, value, valueType: calculationMode });
