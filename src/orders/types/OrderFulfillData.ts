/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { WarehouseClickAndCollectOptionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: OrderFulfillData
// ====================================================

export interface OrderFulfillData_order_deliveryMethod_ShippingMethod {
  __typename: "ShippingMethod";
  id: string;
}

export interface OrderFulfillData_order_deliveryMethod_Warehouse {
  __typename: "Warehouse";
  id: string;
  clickAndCollectOption: WarehouseClickAndCollectOptionEnum;
}

export type OrderFulfillData_order_deliveryMethod = OrderFulfillData_order_deliveryMethod_ShippingMethod | OrderFulfillData_order_deliveryMethod_Warehouse;

export interface OrderFulfillData_order_lines_allocations_warehouse {
  __typename: "Warehouse";
  id: string;
}

export interface OrderFulfillData_order_lines_allocations {
  __typename: "Allocation";
  quantity: number;
  warehouse: OrderFulfillData_order_lines_allocations_warehouse;
}

export interface OrderFulfillData_order_lines_variant_preorder {
  __typename: "PreorderData";
  endDate: any | null;
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
  name: string;
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
  sku: string | null;
  preorder: OrderFulfillData_order_lines_variant_preorder | null;
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
  quantityToFulfill: number;
  variant: OrderFulfillData_order_lines_variant | null;
  thumbnail: OrderFulfillData_order_lines_thumbnail | null;
}

export interface OrderFulfillData_order {
  __typename: "Order";
  id: string;
  isPaid: boolean;
  deliveryMethod: OrderFulfillData_order_deliveryMethod | null;
  lines: (OrderFulfillData_order_lines | null)[];
  number: string | null;
}

export interface OrderFulfillData {
  order: OrderFulfillData_order | null;
}

export interface OrderFulfillDataVariables {
  orderId: string;
}
