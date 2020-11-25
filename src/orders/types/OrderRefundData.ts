/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

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

export interface OrderRefundData_order_lines_totalPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderRefundData_order_lines_totalPrice {
  __typename: "TaxedMoney";
  gross: OrderRefundData_order_lines_totalPrice_gross;
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
  totalPrice: OrderRefundData_order_lines_totalPrice | null;
  thumbnail: OrderRefundData_order_lines_thumbnail | null;
}

export interface OrderRefundData_order {
  __typename: "Order";
  id: string;
  number: string | null;
  total: OrderRefundData_order_total | null;
  totalCaptured: OrderRefundData_order_totalCaptured | null;
  lines: (OrderRefundData_order_lines | null)[];
}

export interface OrderRefundData {
  order: OrderRefundData_order | null;
}

export interface OrderRefundDataVariables {
  orderId: string;
}
