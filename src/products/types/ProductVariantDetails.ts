/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum, AttributeEntityTypeEnum, MeasurementUnitsEnum, ProductMediaType, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ProductVariantDetails
// ====================================================

export interface ProductVariantDetails_productVariant_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductVariantDetails_productVariant_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductVariantDetails_productVariant_selectionAttributes_attribute_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface ProductVariantDetails_productVariant_selectionAttributes_attribute_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantDetails_productVariant_selectionAttributes_attribute_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantDetails_productVariant_selectionAttributes_attribute_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
  date: any | null;
  dateTime: any | null;
  value: string | null;
}

export interface ProductVariantDetails_productVariant_selectionAttributes_attribute_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: ProductVariantDetails_productVariant_selectionAttributes_attribute_choices_edges_node;
}

export interface ProductVariantDetails_productVariant_selectionAttributes_attribute_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: ProductVariantDetails_productVariant_selectionAttributes_attribute_choices_pageInfo;
  edges: ProductVariantDetails_productVariant_selectionAttributes_attribute_choices_edges[];
}

export interface ProductVariantDetails_productVariant_selectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  unit: MeasurementUnitsEnum | null;
  choices: ProductVariantDetails_productVariant_selectionAttributes_attribute_choices | null;
}

export interface ProductVariantDetails_productVariant_selectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantDetails_productVariant_selectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantDetails_productVariant_selectionAttributes_values_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
  date: any | null;
  dateTime: any | null;
  value: string | null;
}

export interface ProductVariantDetails_productVariant_selectionAttributes {
  __typename: "SelectedAttribute";
  attribute: ProductVariantDetails_productVariant_selectionAttributes_attribute;
  values: (ProductVariantDetails_productVariant_selectionAttributes_values | null)[];
}

export interface ProductVariantDetails_productVariant_nonSelectionAttributes_attribute_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface ProductVariantDetails_productVariant_nonSelectionAttributes_attribute_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantDetails_productVariant_nonSelectionAttributes_attribute_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantDetails_productVariant_nonSelectionAttributes_attribute_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
  date: any | null;
  dateTime: any | null;
  value: string | null;
}

export interface ProductVariantDetails_productVariant_nonSelectionAttributes_attribute_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: ProductVariantDetails_productVariant_nonSelectionAttributes_attribute_choices_edges_node;
}

export interface ProductVariantDetails_productVariant_nonSelectionAttributes_attribute_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: ProductVariantDetails_productVariant_nonSelectionAttributes_attribute_choices_pageInfo;
  edges: ProductVariantDetails_productVariant_nonSelectionAttributes_attribute_choices_edges[];
}

export interface ProductVariantDetails_productVariant_nonSelectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  unit: MeasurementUnitsEnum | null;
  choices: ProductVariantDetails_productVariant_nonSelectionAttributes_attribute_choices | null;
}

export interface ProductVariantDetails_productVariant_nonSelectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantDetails_productVariant_nonSelectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantDetails_productVariant_nonSelectionAttributes_values_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
  date: any | null;
  dateTime: any | null;
  value: string | null;
}

export interface ProductVariantDetails_productVariant_nonSelectionAttributes {
  __typename: "SelectedAttribute";
  attribute: ProductVariantDetails_productVariant_nonSelectionAttributes_attribute;
  values: (ProductVariantDetails_productVariant_nonSelectionAttributes_values | null)[];
}

export interface ProductVariantDetails_productVariant_media {
  __typename: "ProductMedia";
  id: string;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface ProductVariantDetails_productVariant_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface ProductVariantDetails_productVariant_product_media {
  __typename: "ProductMedia";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface ProductVariantDetails_productVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface ProductVariantDetails_productVariant_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductVariantDetails_productVariant_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantDetails_productVariant_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ProductVariantDetails_productVariant_product_channelListings_pricing_priceRange_start_net;
}

export interface ProductVariantDetails_productVariant_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantDetails_productVariant_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ProductVariantDetails_productVariant_product_channelListings_pricing_priceRange_stop_net;
}

export interface ProductVariantDetails_productVariant_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ProductVariantDetails_productVariant_product_channelListings_pricing_priceRange_start | null;
  stop: ProductVariantDetails_productVariant_product_channelListings_pricing_priceRange_stop | null;
}

export interface ProductVariantDetails_productVariant_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ProductVariantDetails_productVariant_product_channelListings_pricing_priceRange | null;
}

export interface ProductVariantDetails_productVariant_product_channelListings {
  __typename: "ProductChannelListing";
  publicationDate: any | null;
  isPublished: boolean;
  channel: ProductVariantDetails_productVariant_product_channelListings_channel;
  pricing: ProductVariantDetails_productVariant_product_channelListings_pricing | null;
}

export interface ProductVariantDetails_productVariant_product_variants_media {
  __typename: "ProductMedia";
  id: string;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface ProductVariantDetails_productVariant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string | null;
  media: ProductVariantDetails_productVariant_product_variants_media[] | null;
}

export interface ProductVariantDetails_productVariant_product {
  __typename: "Product";
  id: string;
  defaultVariant: ProductVariantDetails_productVariant_product_defaultVariant | null;
  media: ProductVariantDetails_productVariant_product_media[] | null;
  name: string;
  thumbnail: ProductVariantDetails_productVariant_product_thumbnail | null;
  channelListings: ProductVariantDetails_productVariant_product_channelListings[] | null;
  variants: (ProductVariantDetails_productVariant_product_variants | null)[] | null;
}

export interface ProductVariantDetails_productVariant_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductVariantDetails_productVariant_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantDetails_productVariant_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantDetails_productVariant_channelListings_preorderThreshold {
  __typename: "PreorderThreshold";
  quantity: number | null;
  soldUnits: number;
}

export interface ProductVariantDetails_productVariant_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: ProductVariantDetails_productVariant_channelListings_channel;
  price: ProductVariantDetails_productVariant_channelListings_price | null;
  costPrice: ProductVariantDetails_productVariant_channelListings_costPrice | null;
  preorderThreshold: ProductVariantDetails_productVariant_channelListings_preorderThreshold | null;
}

export interface ProductVariantDetails_productVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductVariantDetails_productVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductVariantDetails_productVariant_stocks_warehouse;
}

export interface ProductVariantDetails_productVariant_preorder {
  __typename: "PreorderData";
  globalThreshold: number | null;
  globalSoldUnits: number;
  endDate: any | null;
}

export interface ProductVariantDetails_productVariant_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductVariantDetails_productVariant {
  __typename: "ProductVariant";
  id: string;
  metadata: (ProductVariantDetails_productVariant_metadata | null)[];
  privateMetadata: (ProductVariantDetails_productVariant_privateMetadata | null)[];
  selectionAttributes: ProductVariantDetails_productVariant_selectionAttributes[];
  nonSelectionAttributes: ProductVariantDetails_productVariant_nonSelectionAttributes[];
  media: ProductVariantDetails_productVariant_media[] | null;
  name: string;
  product: ProductVariantDetails_productVariant_product;
  channelListings: ProductVariantDetails_productVariant_channelListings[] | null;
  sku: string | null;
  stocks: (ProductVariantDetails_productVariant_stocks | null)[] | null;
  trackInventory: boolean;
  preorder: ProductVariantDetails_productVariant_preorder | null;
  weight: ProductVariantDetails_productVariant_weight | null;
  quantityLimitPerCustomer: number | null;
}

export interface ProductVariantDetails {
  productVariant: ProductVariantDetails_productVariant | null;
}

export interface ProductVariantDetailsVariables {
  id: string;
  firstValues?: number | null;
  afterValues?: string | null;
  lastValues?: number | null;
  beforeValues?: string | null;
}
