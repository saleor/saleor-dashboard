/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: CreateMultipleVariantsData
// ====================================================

export interface CreateMultipleVariantsData_product_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface CreateMultipleVariantsData_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (CreateMultipleVariantsData_product_attributes_attribute_values | null)[] | null;
}

export interface CreateMultipleVariantsData_product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface CreateMultipleVariantsData_product_attributes {
  __typename: "SelectedAttribute";
  attribute: CreateMultipleVariantsData_product_attributes_attribute;
  values: (CreateMultipleVariantsData_product_attributes_values | null)[];
}

export interface CreateMultipleVariantsData_product_productType_availableAttributes_edges_node_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface CreateMultipleVariantsData_product_productType_availableAttributes_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (CreateMultipleVariantsData_product_productType_availableAttributes_edges_node_values | null)[] | null;
  filterableInDashboard: boolean;
  visibleInStorefront: boolean;
}

export interface CreateMultipleVariantsData_product_productType_availableAttributes_edges {
  __typename: "AttributeCountableEdge";
  node: CreateMultipleVariantsData_product_productType_availableAttributes_edges_node;
}

export interface CreateMultipleVariantsData_product_productType_availableAttributes {
  __typename: "AttributeCountableConnection";
  edges: CreateMultipleVariantsData_product_productType_availableAttributes_edges[];
}

export interface CreateMultipleVariantsData_product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface CreateMultipleVariantsData_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (CreateMultipleVariantsData_product_productType_variantAttributes_values | null)[] | null;
  filterableInDashboard: boolean;
  visibleInStorefront: boolean;
}

export interface CreateMultipleVariantsData_product_productType {
  __typename: "ProductType";
  id: string;
  availableAttributes: CreateMultipleVariantsData_product_productType_availableAttributes | null;
  variantAttributes: (CreateMultipleVariantsData_product_productType_variantAttributes | null)[] | null;
}

export interface CreateMultipleVariantsData_product_pricing_priceRangeUndiscounted_start_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CreateMultipleVariantsData_product_pricing_priceRangeUndiscounted_start {
  __typename: "TaxedMoney";
  gross: CreateMultipleVariantsData_product_pricing_priceRangeUndiscounted_start_gross;
}

export interface CreateMultipleVariantsData_product_pricing_priceRangeUndiscounted_stop_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CreateMultipleVariantsData_product_pricing_priceRangeUndiscounted_stop {
  __typename: "TaxedMoney";
  gross: CreateMultipleVariantsData_product_pricing_priceRangeUndiscounted_stop_gross;
}

export interface CreateMultipleVariantsData_product_pricing_priceRangeUndiscounted {
  __typename: "TaxedMoneyRange";
  start: CreateMultipleVariantsData_product_pricing_priceRangeUndiscounted_start | null;
  stop: CreateMultipleVariantsData_product_pricing_priceRangeUndiscounted_stop | null;
}

export interface CreateMultipleVariantsData_product_pricing {
  __typename: "ProductPricingInfo";
  priceRangeUndiscounted: CreateMultipleVariantsData_product_pricing_priceRangeUndiscounted | null;
}

export interface CreateMultipleVariantsData_product {
  __typename: "Product";
  id: string;
  attributes: CreateMultipleVariantsData_product_attributes[];
  productType: CreateMultipleVariantsData_product_productType;
  pricing: CreateMultipleVariantsData_product_pricing | null;
}

export interface CreateMultipleVariantsData_warehouses_edges_node {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface CreateMultipleVariantsData_warehouses_edges {
  __typename: "WarehouseCountableEdge";
  node: CreateMultipleVariantsData_warehouses_edges_node;
}

export interface CreateMultipleVariantsData_warehouses {
  __typename: "WarehouseCountableConnection";
  edges: CreateMultipleVariantsData_warehouses_edges[];
}

export interface CreateMultipleVariantsData {
  product: CreateMultipleVariantsData_product | null;
  warehouses: CreateMultipleVariantsData_warehouses | null;
}

export interface CreateMultipleVariantsDataVariables {
  id: string;
}
