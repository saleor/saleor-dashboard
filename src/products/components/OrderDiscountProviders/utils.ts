import { type OrderDetailsFragment, OrderDiscountType } from "@dashboard/graphql";
import { type OrderDiscountCommonInput } from "@dashboard/orders/components/OrderDiscountModal/types";
import { useState } from "react";

import { type AutomaticDiscountInfo, type OrderLineDiscountData } from "./types";

export const useDiscountDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const closeDialog = () => setIsDialogOpen(false);
  const openDialog = () => setIsDialogOpen(true);

  return { closeDialog, isDialogOpen, openDialog };
};
export const getManualOrderDiscount = (order: OrderDetailsFragment) =>
  order ? getOrderDiscount(order, OrderDiscountType.MANUAL) : null;

const getOrderDiscount = (order: OrderDetailsFragment, discountType: OrderDiscountType) =>
  order.discounts.find(({ type }) => type === discountType);

export const getOrderLineDiscount = (
  order: OrderDetailsFragment,
  orderLineId: string,
): OrderLineDiscountData | null => {
  const line = order.lines.find(({ id }) => id === orderLineId);

  if (!line) {
    return null;
  }

  const manualDiscount = line.discounts?.find(d => d.type === OrderDiscountType.MANUAL);

  if (!manualDiscount) {
    return null;
  }

  return {
    calculationMode: manualDiscount.valueType,
    moneyValue: line.unitDiscount,
    reason: manualDiscount.reason ?? "",
    undiscountedPrice: line.undiscountedUnitPrice,
    value: manualDiscount.value,
  };
};

export const getParsedDiscountData = ({
  value,
  calculationMode,
  reason,
}: OrderDiscountCommonInput) => ({ reason, value, valueType: calculationMode });

export const getAutomaticLineDiscounts = (
  order: OrderDetailsFragment,
  orderLineId: string,
): AutomaticDiscountInfo[] => {
  const line = order.lines.find(({ id }) => id === orderLineId);

  if (!line) {
    return [];
  }

  const hasAnyPriceReduction =
    line.unitPrice.gross.amount < line.undiscountedUnitPrice.gross.amount;

  if (!hasAnyPriceReduction) {
    return [];
  }

  const automaticLineDiscounts: AutomaticDiscountInfo[] = (line.discounts ?? [])
    .filter(d => d.type !== OrderDiscountType.MANUAL)
    .map(d => ({ type: d.type, name: d.translatedName || d.name }));

  if (automaticLineDiscounts.length > 0) {
    return automaticLineDiscounts;
  }

  const hasManualLineDiscount = (line.discounts ?? []).some(
    d => d.type === OrderDiscountType.MANUAL,
  );

  if (!hasManualLineDiscount) {
    return order.discounts
      .filter(d => d.type !== OrderDiscountType.MANUAL)
      .map(d => ({ type: d.type, name: d.name }));
  }

  return [];
};
