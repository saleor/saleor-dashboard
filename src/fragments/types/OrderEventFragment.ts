/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderEventsEmailsEnum, DiscountValueTypeEnum, OrderEventsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: OrderEventFragment
// ====================================================

export interface OrderEventFragment_discount_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderEventFragment_discount_oldAmount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderEventFragment_discount {
  __typename: "OrderEventDiscountObject";
  valueType: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderEventFragment_discount_amount | null;
  oldValueType: DiscountValueTypeEnum | null;
  oldValue: any | null;
  oldAmount: OrderEventFragment_discount_oldAmount | null;
}

export interface OrderEventFragment_relatedOrder {
  __typename: "Order";
  id: string;
  number: string | null;
}

export interface OrderEventFragment_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface OrderEventFragment_lines_discount_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderEventFragment_lines_discount_oldAmount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderEventFragment_lines_discount {
  __typename: "OrderEventDiscountObject";
  valueType: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderEventFragment_lines_discount_amount | null;
  oldValueType: DiscountValueTypeEnum | null;
  oldValue: any | null;
  oldAmount: OrderEventFragment_lines_discount_oldAmount | null;
}

export interface OrderEventFragment_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  productName: string;
  variantName: string;
}

export interface OrderEventFragment_lines {
  __typename: "OrderEventOrderLineObject";
  quantity: number | null;
  itemName: string | null;
  discount: OrderEventFragment_lines_discount | null;
  orderLine: OrderEventFragment_lines_orderLine | null;
}

export interface OrderEventFragment {
  __typename: "OrderEvent";
  id: string;
  amount: number | null;
  shippingCostsIncluded: boolean | null;
  date: any | null;
  email: string | null;
  emailType: OrderEventsEmailsEnum | null;
  invoiceNumber: string | null;
  discount: OrderEventFragment_discount | null;
  relatedOrder: OrderEventFragment_relatedOrder | null;
  message: string | null;
  quantity: number | null;
  transactionReference: string | null;
  type: OrderEventsEnum | null;
  user: OrderEventFragment_user | null;
  lines: (OrderEventFragment_lines | null)[] | null;
}
