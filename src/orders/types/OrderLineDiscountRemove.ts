/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrderErrorCode, DiscountValueTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: OrderLineDiscountRemove
// ====================================================

export interface OrderLineDiscountRemove_orderLineDiscountRemove_errors {
  __typename: "OrderError";
  code: OrderErrorCode;
  field: string | null;
}

export interface OrderLineDiscountRemove_orderLineDiscountRemove_orderLine_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderLineDiscountRemove_orderLineDiscountRemove_orderLine_unitDiscount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountRemove_orderLineDiscountRemove_orderLine_undiscountedUnitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountRemove_orderLineDiscountRemove_orderLine_undiscountedUnitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountRemove_orderLineDiscountRemove_orderLine_undiscountedUnitPrice {
  __typename: "TaxedMoney";
  currency: string;
  gross: OrderLineDiscountRemove_orderLineDiscountRemove_orderLine_undiscountedUnitPrice_gross;
  net: OrderLineDiscountRemove_orderLineDiscountRemove_orderLine_undiscountedUnitPrice_net;
}

export interface OrderLineDiscountRemove_orderLineDiscountRemove_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountRemove_orderLineDiscountRemove_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountRemove_orderLineDiscountRemove_orderLine_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderLineDiscountRemove_orderLineDiscountRemove_orderLine_unitPrice_gross;
  net: OrderLineDiscountRemove_orderLineDiscountRemove_orderLine_unitPrice_net;
}

export interface OrderLineDiscountRemove_orderLineDiscountRemove_orderLine_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderLineDiscountRemove_orderLineDiscountRemove_orderLine {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderLineDiscountRemove_orderLineDiscountRemove_orderLine_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitDiscount: OrderLineDiscountRemove_orderLineDiscountRemove_orderLine_unitDiscount;
  unitDiscountValue: any;
  unitDiscountReason: string | null;
  unitDiscountType: DiscountValueTypeEnum | null;
  undiscountedUnitPrice: OrderLineDiscountRemove_orderLineDiscountRemove_orderLine_undiscountedUnitPrice;
  unitPrice: OrderLineDiscountRemove_orderLineDiscountRemove_orderLine_unitPrice;
  thumbnail: OrderLineDiscountRemove_orderLineDiscountRemove_orderLine_thumbnail | null;
}

export interface OrderLineDiscountRemove_orderLineDiscountRemove {
  __typename: "OrderLineDiscountRemove";
  errors: OrderLineDiscountRemove_orderLineDiscountRemove_errors[];
  orderLine: OrderLineDiscountRemove_orderLineDiscountRemove_orderLine | null;
}

export interface OrderLineDiscountRemove {
  orderLineDiscountRemove: OrderLineDiscountRemove_orderLineDiscountRemove | null;
}

export interface OrderLineDiscountRemoveVariables {
  orderLineId: string;
}
