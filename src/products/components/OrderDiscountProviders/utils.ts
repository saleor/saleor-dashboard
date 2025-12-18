import { OrderDetailsFragment, OrderDiscountType } from "@dashboard/graphql";
import { OrderDiscountCommonInput } from "@dashboard/orders/components/OrderDiscountCommonModal/types";
import { useState } from "react";

import { OrderLineDiscountData } from "./types";

export const useDiscountDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const closeDialog = () => setIsDialogOpen(false);
  const openDialog = () => setIsDialogOpen(true);

  return { closeDialog, isDialogOpen, openDialog };
};
export const getManualOrderDiscount = (order: OrderDetailsFragment) =>
  order ? getOrderDiscount(order, OrderDiscountType.MANUAL) : null;

const getOrderDiscount = (order: OrderDetailsFragment, discountType: OrderDiscountType): any =>
  (order as any).discounts?.find(({ type }: any) => type === discountType);

export const getOrderLineDiscount = (
  order: OrderDetailsFragment,
  orderLineId: string,
): OrderLineDiscountData => {
  const orderLine = (order as any).lines?.find(({ id }: any) => id === orderLineId);

  if (!orderLine) {
    return null as any;
  }

  const {
    unitDiscount: moneyValue,
    unitDiscountReason: reason,
    unitDiscountValue: value,
    undiscountedUnitPrice: undiscountedPrice,
    unitDiscountType: calculationMode,
  } = orderLine;

  if (!value) {
    return null as any;
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
