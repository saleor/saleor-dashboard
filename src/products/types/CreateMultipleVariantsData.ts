/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: CreateMultipleVariantsData
// ====================================================

export interface CreateMultipleVariantsData_product_attributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface CreateMultipleVariantsData_product_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: CreateMultipleVariantsData_product_attributes_attribute_values_file | null;
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

export interface CreateMultipleVariantsData_product_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface CreateMultipleVariantsData_product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: CreateMultipleVariantsData_product_attributes_values_file | null;
}

export interface CreateMultipleVariantsData_product_attributes {
  __typename: "SelectedAttribute";
  attribute: CreateMultipleVariantsData_product_attributes_attribute;
  values: (CreateMultipleVariantsData_product_attributes_values | null)[];
}

export interface CreateMultipleVariantsData_product_productType_variantAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface CreateMultipleVariantsData_product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: CreateMultipleVariantsData_product_productType_variantAttributes_values_file | null;
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

export interface CreateMultipleVariantsData_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface CreateMultipleVariantsData_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CreateMultipleVariantsData_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: CreateMultipleVariantsData_product_channelListings_pricing_priceRange_start_net;
}

export interface CreateMultipleVariantsData_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CreateMultipleVariantsData_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: CreateMultipleVariantsData_product_channelListings_pricing_priceRange_stop_net;
}

export interface CreateMultipleVariantsData_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: CreateMultipleVariantsData_product_channelListings_pricing_priceRange_start | null;
  stop: CreateMultipleVariantsData_product_channelListings_pricing_priceRange_stop | null;
}

export interface CreateMultipleVariantsData_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: CreateMultipleVariantsData_product_channelListings_pricing_priceRange | null;
}

export interface CreateMultipleVariantsData_product_channelListings {
  __typename: "ProductChannelListing";
  channel: CreateMultipleVariantsData_product_channelListings_channel;
  pricing: CreateMultipleVariantsData_product_channelListings_pricing | null;
}

export interface CreateMultipleVariantsData_product {
  __typename: "Product";
  id: string;
  attributes: CreateMultipleVariantsData_product_attributes[];
  productType: CreateMultipleVariantsData_product_productType;
  channelListings: CreateMultipleVariantsData_product_channelListings[] | null;
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
