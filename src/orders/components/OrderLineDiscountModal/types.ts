export enum OrderLineDiscountType {
  PERCENTAGE = "percentage",
  FIXED_AMOUNT = "fixedAmount"
}

export interface OrderLineDiscount {
  type: OrderLineDiscountType;
  value: number;
  reason: string;
}
