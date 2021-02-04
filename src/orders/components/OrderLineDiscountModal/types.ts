import { OrderUrlQueryParams } from "@saleor/orders/urls";

export enum OrderDiscountCalculationMode {
  PERCENTAGE = "percentage",
  FIXED_AMOUNT = "fixedAmount"
}

export interface OrderLineDiscountData extends OrderDiscountData {
  orderLineId: string;
}

export interface OrderDiscountData {
  type: OrderDiscountCalculationMode;
  value: number;
  reason: string;
}

export const ORDER_DISCOUNT = "add-order-discount";
export const ORDER_LINE_DISCOUNT = "add-order-line-discount";

export type OrderDiscountType =
  | typeof ORDER_DISCOUNT
  | typeof ORDER_LINE_DISCOUNT;

export interface OrderLineDiscountModalUrlParams extends OrderUrlQueryParams {
  action: OrderDiscountType;
}
