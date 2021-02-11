/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrderDiscountCommonInput, OrderErrorCode, OrderLineUnitDiscountType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: OrderLineDiscountUpdate
// ====================================================

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_errors {
  __typename: "OrderError";
  code: OrderErrorCode;
  field: string | null;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_orderLine_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_orderLine_unitDiscount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_orderLine_undiscountedUnitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_orderLine_undiscountedUnitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_orderLine_undiscountedUnitPrice {
  __typename: "TaxedMoney";
  currency: string;
  gross: OrderLineDiscountUpdate_orderLineDiscountUpdate_orderLine_undiscountedUnitPrice_gross;
  net: OrderLineDiscountUpdate_orderLineDiscountUpdate_orderLine_undiscountedUnitPrice_net;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_orderLine_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderLineDiscountUpdate_orderLineDiscountUpdate_orderLine_unitPrice_gross;
  net: OrderLineDiscountUpdate_orderLineDiscountUpdate_orderLine_unitPrice_net;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_orderLine_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_orderLine {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderLineDiscountUpdate_orderLineDiscountUpdate_orderLine_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitDiscount: OrderLineDiscountUpdate_orderLineDiscountUpdate_orderLine_unitDiscount;
  unitDiscountValue: any;
  unitDiscountReason: string | null;
  unitDiscountType: OrderLineUnitDiscountType;
  undiscountedUnitPrice: OrderLineDiscountUpdate_orderLineDiscountUpdate_orderLine_undiscountedUnitPrice;
  unitPrice: OrderLineDiscountUpdate_orderLineDiscountUpdate_orderLine_unitPrice;
  thumbnail: OrderLineDiscountUpdate_orderLineDiscountUpdate_orderLine_thumbnail | null;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate {
  __typename: "OrderLineDiscountUpdate";
  errors: OrderLineDiscountUpdate_orderLineDiscountUpdate_errors[];
  orderLine: OrderLineDiscountUpdate_orderLineDiscountUpdate_orderLine | null;
}

export interface OrderLineDiscountUpdate {
  orderLineDiscountUpdate: OrderLineDiscountUpdate_orderLineDiscountUpdate | null;
}

export interface OrderLineDiscountUpdateVariables {
  input: OrderDiscountCommonInput;
  orderLineId: string;
}
