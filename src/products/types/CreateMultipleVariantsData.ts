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
  values: (CreateMultipleVariantsData_product_productType_variantAttributes_values | null)[] | null;
}

export interface CreateMultipleVariantsData_product_productType {
  __typename: "ProductType";
  id: string;
  variantAttributes: (CreateMultipleVariantsData_product_productType_variantAttributes | null)[] | null;
}

export interface CreateMultipleVariantsData_product_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface CreateMultipleVariantsData_product_channelListing_discountedPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CreateMultipleVariantsData_product_channelListing {
  __typename: "ProductChannelListing";
  channel: CreateMultipleVariantsData_product_channelListing_channel;
  discountedPrice: CreateMultipleVariantsData_product_channelListing_discountedPrice | null;
}

export interface CreateMultipleVariantsData_product {
  __typename: "Product";
  id: string;
  attributes: CreateMultipleVariantsData_product_attributes[];
  productType: CreateMultipleVariantsData_product_productType;
  channelListing: CreateMultipleVariantsData_product_channelListing[] | null;
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
  channel?: string | null;
}
