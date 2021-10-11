/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductVariantCreateInput, ProductErrorCode, AttributeInputTypeEnum, AttributeEntityTypeEnum, MeasurementUnitsEnum, ProductMediaType, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VariantCreate
// ====================================================

export interface VariantCreate_productVariantCreate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
  attributes: string[] | null;
}

export interface VariantCreate_productVariantCreate_productVariant_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VariantCreate_productVariantCreate_productVariant_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VariantCreate_productVariantCreate_productVariant_selectionAttributes_attribute_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface VariantCreate_productVariantCreate_productVariant_selectionAttributes_attribute_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantCreate_productVariantCreate_productVariant_selectionAttributes_attribute_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantCreate_productVariantCreate_productVariant_selectionAttributes_attribute_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
  date: any | null;
  dateTime: any | null;
  value: string | null;
}

export interface VariantCreate_productVariantCreate_productVariant_selectionAttributes_attribute_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: VariantCreate_productVariantCreate_productVariant_selectionAttributes_attribute_choices_edges_node;
}

export interface VariantCreate_productVariantCreate_productVariant_selectionAttributes_attribute_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: VariantCreate_productVariantCreate_productVariant_selectionAttributes_attribute_choices_pageInfo;
  edges: VariantCreate_productVariantCreate_productVariant_selectionAttributes_attribute_choices_edges[];
}

export interface VariantCreate_productVariantCreate_productVariant_selectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  unit: MeasurementUnitsEnum | null;
  choices: VariantCreate_productVariantCreate_productVariant_selectionAttributes_attribute_choices | null;
}

export interface VariantCreate_productVariantCreate_productVariant_selectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantCreate_productVariantCreate_productVariant_selectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantCreate_productVariantCreate_productVariant_selectionAttributes_values_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
  date: any | null;
  dateTime: any | null;
  value: string | null;
}

export interface VariantCreate_productVariantCreate_productVariant_selectionAttributes {
  __typename: "SelectedAttribute";
  attribute: VariantCreate_productVariantCreate_productVariant_selectionAttributes_attribute;
  values: (VariantCreate_productVariantCreate_productVariant_selectionAttributes_values | null)[];
}

export interface VariantCreate_productVariantCreate_productVariant_nonSelectionAttributes_attribute_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface VariantCreate_productVariantCreate_productVariant_nonSelectionAttributes_attribute_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantCreate_productVariantCreate_productVariant_nonSelectionAttributes_attribute_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantCreate_productVariantCreate_productVariant_nonSelectionAttributes_attribute_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
  date: any | null;
  dateTime: any | null;
  value: string | null;
}

export interface VariantCreate_productVariantCreate_productVariant_nonSelectionAttributes_attribute_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: VariantCreate_productVariantCreate_productVariant_nonSelectionAttributes_attribute_choices_edges_node;
}

export interface VariantCreate_productVariantCreate_productVariant_nonSelectionAttributes_attribute_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: VariantCreate_productVariantCreate_productVariant_nonSelectionAttributes_attribute_choices_pageInfo;
  edges: VariantCreate_productVariantCreate_productVariant_nonSelectionAttributes_attribute_choices_edges[];
}

export interface VariantCreate_productVariantCreate_productVariant_nonSelectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  unit: MeasurementUnitsEnum | null;
  choices: VariantCreate_productVariantCreate_productVariant_nonSelectionAttributes_attribute_choices | null;
}

export interface VariantCreate_productVariantCreate_productVariant_nonSelectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantCreate_productVariantCreate_productVariant_nonSelectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantCreate_productVariantCreate_productVariant_nonSelectionAttributes_values_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
  date: any | null;
  dateTime: any | null;
  value: string | null;
}

export interface VariantCreate_productVariantCreate_productVariant_nonSelectionAttributes {
  __typename: "SelectedAttribute";
  attribute: VariantCreate_productVariantCreate_productVariant_nonSelectionAttributes_attribute;
  values: (VariantCreate_productVariantCreate_productVariant_nonSelectionAttributes_values | null)[];
}

export interface VariantCreate_productVariantCreate_productVariant_media {
  __typename: "ProductMedia";
  id: string;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface VariantCreate_productVariantCreate_productVariant_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface VariantCreate_productVariantCreate_productVariant_product_media {
  __typename: "ProductMedia";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface VariantCreate_productVariantCreate_productVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface VariantCreate_productVariantCreate_productVariant_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VariantCreate_productVariantCreate_productVariant_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantCreate_productVariantCreate_productVariant_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: VariantCreate_productVariantCreate_productVariant_product_channelListings_pricing_priceRange_start_net;
}

export interface VariantCreate_productVariantCreate_productVariant_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantCreate_productVariantCreate_productVariant_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: VariantCreate_productVariantCreate_productVariant_product_channelListings_pricing_priceRange_stop_net;
}

export interface VariantCreate_productVariantCreate_productVariant_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: VariantCreate_productVariantCreate_productVariant_product_channelListings_pricing_priceRange_start | null;
  stop: VariantCreate_productVariantCreate_productVariant_product_channelListings_pricing_priceRange_stop | null;
}

export interface VariantCreate_productVariantCreate_productVariant_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: VariantCreate_productVariantCreate_productVariant_product_channelListings_pricing_priceRange | null;
}

export interface VariantCreate_productVariantCreate_productVariant_product_channelListings {
  __typename: "ProductChannelListing";
  publicationDate: any | null;
  isPublished: boolean;
  channel: VariantCreate_productVariantCreate_productVariant_product_channelListings_channel;
  pricing: VariantCreate_productVariantCreate_productVariant_product_channelListings_pricing | null;
}

export interface VariantCreate_productVariantCreate_productVariant_product_variants_media {
  __typename: "ProductMedia";
  id: string;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface VariantCreate_productVariantCreate_productVariant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string | null;
  media: VariantCreate_productVariantCreate_productVariant_product_variants_media[] | null;
}

export interface VariantCreate_productVariantCreate_productVariant_product {
  __typename: "Product";
  id: string;
  defaultVariant: VariantCreate_productVariantCreate_productVariant_product_defaultVariant | null;
  media: VariantCreate_productVariantCreate_productVariant_product_media[] | null;
  name: string;
  thumbnail: VariantCreate_productVariantCreate_productVariant_product_thumbnail | null;
  channelListings: VariantCreate_productVariantCreate_productVariant_product_channelListings[] | null;
  variants: (VariantCreate_productVariantCreate_productVariant_product_variants | null)[] | null;
}

export interface VariantCreate_productVariantCreate_productVariant_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VariantCreate_productVariantCreate_productVariant_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantCreate_productVariantCreate_productVariant_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantCreate_productVariantCreate_productVariant_channelListings_preorderThreshold {
  __typename: "PreorderThreshold";
  quantity: number | null;
  soldUnits: number;
}

export interface VariantCreate_productVariantCreate_productVariant_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: VariantCreate_productVariantCreate_productVariant_channelListings_channel;
  price: VariantCreate_productVariantCreate_productVariant_channelListings_price | null;
  costPrice: VariantCreate_productVariantCreate_productVariant_channelListings_costPrice | null;
  preorderThreshold: VariantCreate_productVariantCreate_productVariant_channelListings_preorderThreshold | null;
}

export interface VariantCreate_productVariantCreate_productVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface VariantCreate_productVariantCreate_productVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: VariantCreate_productVariantCreate_productVariant_stocks_warehouse;
}

export interface VariantCreate_productVariantCreate_productVariant_preorder {
  __typename: "PreorderData";
  globalThreshold: number | null;
  globalSoldUnits: number;
  endDate: any | null;
}

export interface VariantCreate_productVariantCreate_productVariant_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface VariantCreate_productVariantCreate_productVariant {
  __typename: "ProductVariant";
  id: string;
  metadata: (VariantCreate_productVariantCreate_productVariant_metadata | null)[];
  privateMetadata: (VariantCreate_productVariantCreate_productVariant_privateMetadata | null)[];
  selectionAttributes: VariantCreate_productVariantCreate_productVariant_selectionAttributes[];
  nonSelectionAttributes: VariantCreate_productVariantCreate_productVariant_nonSelectionAttributes[];
  media: VariantCreate_productVariantCreate_productVariant_media[] | null;
  name: string;
  product: VariantCreate_productVariantCreate_productVariant_product;
  channelListings: VariantCreate_productVariantCreate_productVariant_channelListings[] | null;
  sku: string | null;
  stocks: (VariantCreate_productVariantCreate_productVariant_stocks | null)[] | null;
  trackInventory: boolean;
  preorder: VariantCreate_productVariantCreate_productVariant_preorder | null;
  weight: VariantCreate_productVariantCreate_productVariant_weight | null;
}

export interface VariantCreate_productVariantCreate {
  __typename: "ProductVariantCreate";
  errors: VariantCreate_productVariantCreate_errors[];
  productVariant: VariantCreate_productVariantCreate_productVariant | null;
}

export interface VariantCreate {
  productVariantCreate: VariantCreate_productVariantCreate | null;
}

export interface VariantCreateVariables {
  input: ProductVariantCreateInput;
  firstValues?: number | null;
  afterValues?: string | null;
  lastValues?: number | null;
  beforeValues?: string | null;
}
