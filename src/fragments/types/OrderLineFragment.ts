/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DiscountValueTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: OrderLineFragment
// ====================================================

export interface OrderLineFragment_allocations_warehouse {
  __typename: "Warehouse";
  id: string;
}

export interface OrderLineFragment_allocations {
  __typename: "Allocation";
  quantity: number;
  warehouse: OrderLineFragment_allocations_warehouse;
}

export interface OrderLineFragment_variant_preorder {
  __typename: "PreorderData";
  endDate: any | null;
}

export interface OrderLineFragment_variant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
}

export interface OrderLineFragment_variant_stocks {
  __typename: "Stock";
  warehouse: OrderLineFragment_variant_stocks_warehouse;
  quantity: number;
  quantityAllocated: number;
}

export interface OrderLineFragment_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number | null;
  preorder: OrderLineFragment_variant_preorder | null;
  stocks: (OrderLineFragment_variant_stocks | null)[] | null;
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
  allocations: OrderLineFragment_allocations[] | null;
  variant: OrderLineFragment_variant | null;
  productName: string;
  productSku: string | null;
  quantity: number;
  quantityFulfilled: number;
  quantityToFulfill: number;
  unitDiscount: OrderLineFragment_unitDiscount;
  unitDiscountValue: any;
  unitDiscountReason: string | null;
  unitDiscountType: DiscountValueTypeEnum | null;
  undiscountedUnitPrice: OrderLineFragment_undiscountedUnitPrice;
  unitPrice: OrderLineFragment_unitPrice;
  thumbnail: OrderLineFragment_thumbnail | null;
}
