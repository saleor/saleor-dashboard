/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OrderFulfillData
// ====================================================

export interface OrderFulfillData_order_lines_allocations_warehouse {
  __typename: "Warehouse";
  id: string;
}

export interface OrderFulfillData_order_lines_allocations {
  __typename: "Allocation";
  quantity: number;
  warehouse: OrderFulfillData_order_lines_allocations_warehouse;
}

export interface OrderFulfillData_order_lines_variant_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
}

export interface OrderFulfillData_order_lines_variant_attributes {
  __typename: "SelectedAttribute";
  values: (OrderFulfillData_order_lines_variant_attributes_values | null)[];
}

export interface OrderFulfillData_order_lines_variant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
}

export interface OrderFulfillData_order_lines_variant_stocks {
  __typename: "Stock";
  id: string;
  warehouse: OrderFulfillData_order_lines_variant_stocks_warehouse;
  quantity: number;
  quantityAllocated: number;
}

export interface OrderFulfillData_order_lines_variant {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  attributes: OrderFulfillData_order_lines_variant_attributes[];
  stocks: (OrderFulfillData_order_lines_variant_stocks | null)[] | null;
  trackInventory: boolean;
}

export interface OrderFulfillData_order_lines_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderFulfillData_order_lines {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  productName: string;
  quantity: number;
  allocations: OrderFulfillData_order_lines_allocations[] | null;
  quantityFulfilled: number;
  variant: OrderFulfillData_order_lines_variant | null;
  thumbnail: OrderFulfillData_order_lines_thumbnail | null;
}

export interface OrderFulfillData_order {
  __typename: "Order";
  id: string;
  lines: (OrderFulfillData_order_lines | null)[];
  number: string | null;
}

export interface OrderFulfillData {
  order: OrderFulfillData_order | null;
}

export interface OrderFulfillDataVariables {
  orderId: string;
}
