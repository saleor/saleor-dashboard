/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FulfillmentStatus } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: OrderRefundData
// ====================================================

export interface OrderRefundData_order_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderRefundData_order_total {
  __typename: "TaxedMoney";
  gross: OrderRefundData_order_total_gross;
}

export interface OrderRefundData_order_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderRefundData_order_shippingPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderRefundData_order_shippingPrice {
  __typename: "TaxedMoney";
  gross: OrderRefundData_order_shippingPrice_gross;
}

export interface OrderRefundData_order_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderRefundData_order_lines_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderRefundData_order_lines_unitPrice_gross;
}

export interface OrderRefundData_order_lines_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderRefundData_order_lines {
  __typename: "OrderLine";
  id: string;
  productName: string;
  quantity: number;
  unitPrice: OrderRefundData_order_lines_unitPrice | null;
  thumbnail: OrderRefundData_order_lines_thumbnail | null;
  quantityFulfilled: number;
}

export interface OrderRefundData_order_fulfillments_lines_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderRefundData_order_fulfillments_lines_orderLine_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderRefundData_order_fulfillments_lines_orderLine_unitPrice_gross;
}

export interface OrderRefundData_order_fulfillments_lines_orderLine_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderRefundData_order_fulfillments_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  productName: string;
  quantity: number;
  unitPrice: OrderRefundData_order_fulfillments_lines_orderLine_unitPrice | null;
  thumbnail: OrderRefundData_order_fulfillments_lines_orderLine_thumbnail | null;
}

export interface OrderRefundData_order_fulfillments_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: OrderRefundData_order_fulfillments_lines_orderLine | null;
}

export interface OrderRefundData_order_fulfillments {
  __typename: "Fulfillment";
  id: string;
  status: FulfillmentStatus;
  fulfillmentOrder: number;
  lines: (OrderRefundData_order_fulfillments_lines | null)[] | null;
}

export interface OrderRefundData_order {
  __typename: "Order";
  id: string;
  number: string | null;
  total: OrderRefundData_order_total | null;
  totalCaptured: OrderRefundData_order_totalCaptured | null;
  shippingPrice: OrderRefundData_order_shippingPrice | null;
  lines: (OrderRefundData_order_lines | null)[];
  fulfillments: (OrderRefundData_order_fulfillments | null)[];
}

export interface OrderRefundData {
  order: OrderRefundData_order | null;
}

export interface OrderRefundDataVariables {
  orderId: string;
}
