/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DiscountValueTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: OrderLineFragment
// ====================================================

export interface OrderLineFragment_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderLineFragment_unitDiscount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineFragment_undiscountedUnitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineFragment_undiscountedUnitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineFragment_undiscountedUnitPrice {
  __typename: "TaxedMoney";
  currency: string;
  gross: OrderLineFragment_undiscountedUnitPrice_gross;
  net: OrderLineFragment_undiscountedUnitPrice_net;
}

export interface OrderLineFragment_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineFragment_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineFragment_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderLineFragment_unitPrice_gross;
  net: OrderLineFragment_unitPrice_net;
}

export interface OrderLineFragment_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderLineFragment {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderLineFragment_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitDiscount: OrderLineFragment_unitDiscount;
  unitDiscountValue: any;
  unitDiscountReason: string | null;
  unitDiscountType: DiscountValueTypeEnum | null;
  undiscountedUnitPrice: OrderLineFragment_undiscountedUnitPrice;
  unitPrice: OrderLineFragment_unitPrice;
  thumbnail: OrderLineFragment_thumbnail | null;
}
