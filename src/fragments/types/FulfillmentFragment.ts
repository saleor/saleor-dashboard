/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FulfillmentStatus } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: FulfillmentFragment
// ====================================================

export interface FulfillmentFragment_lines_orderLine_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
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
  variant: FulfillmentFragment_lines_orderLine_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: FulfillmentFragment_lines_orderLine_unitPrice | null;
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
