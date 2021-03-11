/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrderAddNoteInput, OrderErrorCode, OrderEventsEmailsEnum, DiscountValueTypeEnum, OrderEventsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: OrderAddNote
// ====================================================

export interface OrderAddNote_orderAddNote_errors {
  __typename: "OrderError";
  code: OrderErrorCode;
  field: string | null;
}

export interface OrderAddNote_orderAddNote_order_events_discount_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderAddNote_orderAddNote_order_events_discount_oldAmount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderAddNote_orderAddNote_order_events_discount {
  __typename: "OrderEventDiscountObject";
  valueType: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderAddNote_orderAddNote_order_events_discount_amount | null;
  oldValueType: DiscountValueTypeEnum | null;
  oldValue: any | null;
  oldAmount: OrderAddNote_orderAddNote_order_events_discount_oldAmount | null;
}

export interface OrderAddNote_orderAddNote_order_events_relatedOrder {
  __typename: "Order";
  id: string;
  number: string | null;
}

export interface OrderAddNote_orderAddNote_order_events_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface OrderAddNote_orderAddNote_order_events_lines_discount_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderAddNote_orderAddNote_order_events_lines_discount_oldAmount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderAddNote_orderAddNote_order_events_lines_discount {
  __typename: "OrderEventDiscountObject";
  valueType: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderAddNote_orderAddNote_order_events_lines_discount_amount | null;
  oldValueType: DiscountValueTypeEnum | null;
  oldValue: any | null;
  oldAmount: OrderAddNote_orderAddNote_order_events_lines_discount_oldAmount | null;
}

export interface OrderAddNote_orderAddNote_order_events_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  productName: string;
  variantName: string;
}

export interface OrderAddNote_orderAddNote_order_events_lines {
  __typename: "OrderEventOrderLineObject";
  quantity: number | null;
  itemName: string | null;
  discount: OrderAddNote_orderAddNote_order_events_lines_discount | null;
  orderLine: OrderAddNote_orderAddNote_order_events_lines_orderLine | null;
}

export interface OrderAddNote_orderAddNote_order_events {
  __typename: "OrderEvent";
  id: string;
  amount: number | null;
  shippingCostsIncluded: boolean | null;
  date: any | null;
  email: string | null;
  emailType: OrderEventsEmailsEnum | null;
  invoiceNumber: string | null;
  discount: OrderAddNote_orderAddNote_order_events_discount | null;
  relatedOrder: OrderAddNote_orderAddNote_order_events_relatedOrder | null;
  message: string | null;
  quantity: number | null;
  transactionReference: string | null;
  type: OrderEventsEnum | null;
  user: OrderAddNote_orderAddNote_order_events_user | null;
  lines: (OrderAddNote_orderAddNote_order_events_lines | null)[] | null;
}

export interface OrderAddNote_orderAddNote_order {
  __typename: "Order";
  id: string;
  events: (OrderAddNote_orderAddNote_order_events | null)[] | null;
}

export interface OrderAddNote_orderAddNote {
  __typename: "OrderAddNote";
  errors: OrderAddNote_orderAddNote_errors[];
  order: OrderAddNote_orderAddNote_order | null;
}

export interface OrderAddNote {
  orderAddNote: OrderAddNote_orderAddNote | null;
}

export interface OrderAddNoteVariables {
  order: string;
  input: OrderAddNoteInput;
}
