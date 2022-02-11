/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DiscountValueTypeEnum, FulfillmentStatus } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: FulfillmentFragment
// ====================================================

export interface FulfillmentFragment_lines_orderLine_allocations_warehouse {
  __typename: "Warehouse";
  id: string;
}

export interface FulfillmentFragment_lines_orderLine_allocations {
  __typename: "Allocation";
  id: string;
  quantity: number;
  warehouse: FulfillmentFragment_lines_orderLine_allocations_warehouse;
}

export interface FulfillmentFragment_lines_orderLine_variant_preorder {
  __typename: "PreorderData";
  endDate: any | null;
}

export interface FulfillmentFragment_lines_orderLine_variant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
}

export interface FulfillmentFragment_lines_orderLine_variant_stocks {
  __typename: "Stock";
  id: string;
  warehouse: FulfillmentFragment_lines_orderLine_variant_stocks_warehouse;
  quantity: number;
  quantityAllocated: number;
}

export interface FulfillmentFragment_lines_orderLine_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number | null;
  preorder: FulfillmentFragment_lines_orderLine_variant_preorder | null;
  stocks: (FulfillmentFragment_lines_orderLine_variant_stocks | null)[] | null;
}

export interface FulfillmentFragment_lines_orderLine_unitDiscount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface FulfillmentFragment_lines_orderLine_undiscountedUnitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface FulfillmentFragment_lines_orderLine_undiscountedUnitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface FulfillmentFragment_lines_orderLine_undiscountedUnitPrice {
  __typename: "TaxedMoney";
  currency: string;
  gross: FulfillmentFragment_lines_orderLine_undiscountedUnitPrice_gross;
  net: FulfillmentFragment_lines_orderLine_undiscountedUnitPrice_net;
}

export interface FulfillmentFragment_lines_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface FulfillmentFragment_lines_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface FulfillmentFragment_lines_orderLine_unitPrice {
  __typename: "TaxedMoney";
  gross: FulfillmentFragment_lines_orderLine_unitPrice_gross;
  net: FulfillmentFragment_lines_orderLine_unitPrice_net;
}

export interface FulfillmentFragment_lines_orderLine_thumbnail {
  __typename: "Image";
  url: string;
}

export interface FulfillmentFragment_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  allocations: FulfillmentFragment_lines_orderLine_allocations[] | null;
  variant: FulfillmentFragment_lines_orderLine_variant | null;
  productName: string;
  productSku: string | null;
  quantity: number;
  quantityFulfilled: number;
  quantityToFulfill: number;
  unitDiscount: FulfillmentFragment_lines_orderLine_unitDiscount;
  unitDiscountValue: any;
  unitDiscountReason: string | null;
  unitDiscountType: DiscountValueTypeEnum | null;
  undiscountedUnitPrice: FulfillmentFragment_lines_orderLine_undiscountedUnitPrice;
  unitPrice: FulfillmentFragment_lines_orderLine_unitPrice;
  thumbnail: FulfillmentFragment_lines_orderLine_thumbnail | null;
}

export interface FulfillmentFragment_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: FulfillmentFragment_lines_orderLine | null;
}

export interface FulfillmentFragment_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface FulfillmentFragment {
  __typename: "Fulfillment";
  id: string;
  lines: (FulfillmentFragment_lines | null)[] | null;
  fulfillmentOrder: number;
  status: FulfillmentStatus;
  trackingNumber: string;
  warehouse: FulfillmentFragment_warehouse | null;
}
