import { IMessage } from "@saleor/components/messages";
import { commonMessages } from "@saleor/intl";
import { OrderDiscountCommonInput } from "@saleor/orders/components/OrderDiscountCommonModal/types";
import {
  OrderDetails_order,
  OrderDetails_order_discounts,
  OrderDetails_order_lines
} from "@saleor/orders/types/OrderDetails";
import { OrderDiscountType } from "@saleor/types/globalTypes";
import commonErrorMessages from "@saleor/utils/errors/common";
import { useState } from "react";
import { IntlShape } from "react-intl";

import { OrderLineDiscountData } from "./types";

export const useDiscountDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const closeDialog = () => setIsDialogOpen(false);
  const openDialog = () => setIsDialogOpen(true);

  return { closeDialog, isDialogOpen, openDialog };
};

export const getDiscountNotifierData = (
  errors: any[],
  intl: IntlShape
): IMessage =>
  !errors.length
    ? {
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      }
    : {
        status: "error",
        text: intl.formatMessage(commonErrorMessages.unknownError)
      };

export const getManualOrderDiscount = (order: OrderDetails_order) =>
  order ? getOrderDiscount(order, OrderDiscountType.MANUAL) : null;

export const getOrderDiscount = (
  order: OrderDetails_order,
  discountType: OrderDiscountType
): OrderDetails_order_discounts =>
  order.discounts.find(({ type }) => type === discountType);

export const getOrderLineDiscount = (
  order: OrderDetails_order,
  orderLineId: string
): OrderLineDiscountData => {
  const {
    unitDiscount: moneyValue,
    unitDiscountReason: reason,
    unitDiscountValue: value,
    undiscountedUnitPrice: undiscountedPrice,
    unitDiscountType: calculationMode
  } = order.lines.find(
    ({ id }: OrderDetails_order_lines) => id === orderLineId
  );

  if (!value) {
    return null;
  }

  return {
    calculationMode,
    moneyValue,
    reason,
    undiscountedPrice,
    value
  };
};

export const getParsedDiscountData = ({
  value,
  calculationMode,
  reason
}: OrderDiscountCommonInput) => ({ reason, value, valueType: calculationMode });
