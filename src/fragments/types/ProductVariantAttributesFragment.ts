/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum, AttributeEntityTypeEnum, MeasurementUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ProductVariantAttributesFragment
// ====================================================

export interface ProductVariantAttributesFragment_attributes_attribute_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface ProductVariantAttributesFragment_attributes_attribute_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantAttributesFragment_attributes_attribute_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantAttributesFragment_attributes_attribute_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface ProductVariantAttributesFragment_attributes_attribute_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: ProductVariantAttributesFragment_attributes_attribute_choices_edges_node;
}

export interface ProductVariantAttributesFragment_attributes_attribute_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: ProductVariantAttributesFragment_attributes_attribute_choices_pageInfo;
  edges: ProductVariantAttributesFragment_attributes_attribute_choices_edges[];
}

export interface ProductVariantAttributesFragment_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  unit: MeasurementUnitsEnum | null;
  choices: ProductVariantAttributesFragment_attributes_attribute_choices | null;
}

export interface ProductVariantAttributesFragment_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantAttributesFragment_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantAttributesFragment_attributes_values_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface ProductVariantAttributesFragment_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductVariantAttributesFragment_attributes_attribute;
  values: (ProductVariantAttributesFragment_attributes_values | null)[];
}

export interface ProductVariantAttributesFragment_productType_variantAttributes_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface ProductVariantAttributesFragment_productType_variantAttributes_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantAttributesFragment_productType_variantAttributes_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantAttributesFragment_productType_variantAttributes_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface ProductVariantAttributesFragment_productType_variantAttributes_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: ProductVariantAttributesFragment_productType_variantAttributes_choices_edges_node;
}

export interface ProductVariantAttributesFragment_productType_variantAttributes_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: ProductVariantAttributesFragment_productType_variantAttributes_choices_pageInfo;
  edges: ProductVariantAttributesFragment_productType_variantAttributes_choices_edges[];
}

export interface ProductVariantAttributesFragment_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  choices: ProductVariantAttributesFragment_productType_variantAttributes_choices | null;
}

export interface ProductVariantAttributesFragment_productType {
  __typename: "ProductType";
  id: string;
  variantAttributes: (ProductVariantAttributesFragment_productType_variantAttributes | null)[] | null;
}

export interface ProductVariantAttributesFragment_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductVariantAttributesFragment_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantAttributesFragment_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ProductVariantAttributesFragment_channelListings_pricing_priceRange_start_net;
}

export interface ProductVariantAttributesFragment_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantAttributesFragment_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ProductVariantAttributesFragment_channelListings_pricing_priceRange_stop_net;
}

export interface ProductVariantAttributesFragment_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ProductVariantAttributesFragment_channelListings_pricing_priceRange_start | null;
  stop: ProductVariantAttributesFragment_channelListings_pricing_priceRange_stop | null;
}

export interface ProductVariantAttributesFragment_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ProductVariantAttributesFragment_channelListings_pricing_priceRange | null;
}

export interface ProductVariantAttributesFragment_channelListings {
  __typename: "ProductChannelListing";
  channel: ProductVariantAttributesFragment_channelListings_channel;
  pricing: ProductVariantAttributesFragment_channelListings_pricing | null;
}

export interface ProductVariantAttributesFragment {
  __typename: "Product";
  id: string;
  attributes: ProductVariantAttributesFragment_attributes[];
  productType: ProductVariantAttributesFragment_productType;
  channelListings: ProductVariantAttributesFragment_channelListings[] | null;
}
