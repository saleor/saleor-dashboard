/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductInput, ProductErrorCode, AttributeInputTypeEnum, AttributeEntityTypeEnum, MeasurementUnitsEnum, ProductMediaType, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductUpdate
// ====================================================

export interface ProductUpdate_productUpdate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
  attributes: string[] | null;
}

export interface ProductUpdate_productUpdate_product_attributes_attribute_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface ProductUpdate_productUpdate_product_attributes_attribute_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductUpdate_productUpdate_product_attributes_attribute_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductUpdate_productUpdate_product_attributes_attribute_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
  date: any | null;
  dateTime: any | null;
  value: string | null;
}

export interface ProductUpdate_productUpdate_product_attributes_attribute_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: ProductUpdate_productUpdate_product_attributes_attribute_choices_edges_node;
}

export interface ProductUpdate_productUpdate_product_attributes_attribute_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: ProductUpdate_productUpdate_product_attributes_attribute_choices_pageInfo;
  edges: ProductUpdate_productUpdate_product_attributes_attribute_choices_edges[];
}

export interface ProductUpdate_productUpdate_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  unit: MeasurementUnitsEnum | null;
  choices: ProductUpdate_productUpdate_product_attributes_attribute_choices | null;
}

export interface ProductUpdate_productUpdate_product_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductUpdate_productUpdate_product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductUpdate_productUpdate_product_attributes_values_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
  date: any | null;
  dateTime: any | null;
  value: string | null;
}

export interface ProductUpdate_productUpdate_product_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductUpdate_productUpdate_product_attributes_attribute;
  values: (ProductUpdate_productUpdate_product_attributes_values | null)[];
}

export interface ProductUpdate_productUpdate_product_productType_variantAttributes_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface ProductUpdate_productUpdate_product_productType_variantAttributes_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductUpdate_productUpdate_product_productType_variantAttributes_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductUpdate_productUpdate_product_productType_variantAttributes_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
  date: any | null;
  dateTime: any | null;
  value: string | null;
}

export interface ProductUpdate_productUpdate_product_productType_variantAttributes_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: ProductUpdate_productUpdate_product_productType_variantAttributes_choices_edges_node;
}

export interface ProductUpdate_productUpdate_product_productType_variantAttributes_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: ProductUpdate_productUpdate_product_productType_variantAttributes_choices_pageInfo;
  edges: ProductUpdate_productUpdate_product_productType_variantAttributes_choices_edges[];
}

export interface ProductUpdate_productUpdate_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  unit: MeasurementUnitsEnum | null;
  choices: ProductUpdate_productUpdate_product_productType_variantAttributes_choices | null;
}

export interface ProductUpdate_productUpdate_product_productType_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductUpdate_productUpdate_product_productType {
  __typename: "ProductType";
  id: string;
  variantAttributes: (ProductUpdate_productUpdate_product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
  taxType: ProductUpdate_productUpdate_product_productType_taxType | null;
}

export interface ProductUpdate_productUpdate_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductUpdate_productUpdate_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductUpdate_productUpdate_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ProductUpdate_productUpdate_product_channelListings_pricing_priceRange_start_net;
}

export interface ProductUpdate_productUpdate_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductUpdate_productUpdate_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ProductUpdate_productUpdate_product_channelListings_pricing_priceRange_stop_net;
}

export interface ProductUpdate_productUpdate_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ProductUpdate_productUpdate_product_channelListings_pricing_priceRange_start | null;
  stop: ProductUpdate_productUpdate_product_channelListings_pricing_priceRange_stop | null;
}

export interface ProductUpdate_productUpdate_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ProductUpdate_productUpdate_product_channelListings_pricing_priceRange | null;
}

export interface ProductUpdate_productUpdate_product_channelListings {
  __typename: "ProductChannelListing";
  channel: ProductUpdate_productUpdate_product_channelListings_channel;
  pricing: ProductUpdate_productUpdate_product_channelListings_pricing | null;
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
}

export interface ProductUpdate_productUpdate_product_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductUpdate_productUpdate_product_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductUpdate_productUpdate_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface ProductUpdate_productUpdate_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface ProductUpdate_productUpdate_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface ProductUpdate_productUpdate_product_media {
  __typename: "ProductMedia";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface ProductUpdate_productUpdate_product_variants_media {
  __typename: "ProductMedia";
  url: string;
}

export interface ProductUpdate_productUpdate_product_variants_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductUpdate_productUpdate_product_variants_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductUpdate_productUpdate_product_variants_stocks_warehouse;
}

export interface ProductUpdate_productUpdate_product_variants_preorder {
  __typename: "PreorderData";
  globalThreshold: number | null;
  globalSoldUnits: number;
  endDate: any | null;
}

export interface ProductUpdate_productUpdate_product_variants_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductUpdate_productUpdate_product_variants_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductUpdate_productUpdate_product_variants_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductUpdate_productUpdate_product_variants_channelListings_preorderThreshold {
  __typename: "PreorderThreshold";
  quantity: number | null;
  soldUnits: number;
}

export interface ProductUpdate_productUpdate_product_variants_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: ProductUpdate_productUpdate_product_variants_channelListings_channel;
  price: ProductUpdate_productUpdate_product_variants_channelListings_price | null;
  costPrice: ProductUpdate_productUpdate_product_variants_channelListings_costPrice | null;
  preorderThreshold: ProductUpdate_productUpdate_product_variants_channelListings_preorderThreshold | null;
}

export interface ProductUpdate_productUpdate_product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string | null;
  name: string;
  margin: number | null;
  media: ProductUpdate_productUpdate_product_variants_media[] | null;
  stocks: (ProductUpdate_productUpdate_product_variants_stocks | null)[] | null;
  trackInventory: boolean;
  preorder: ProductUpdate_productUpdate_product_variants_preorder | null;
  channelListings: ProductUpdate_productUpdate_product_variants_channelListings[] | null;
  quantityLimitPerCustomer: number | null;
}

export interface ProductUpdate_productUpdate_product_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductUpdate_productUpdate_product_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductUpdate_productUpdate_product {
  __typename: "Product";
  id: string;
  attributes: ProductUpdate_productUpdate_product_attributes[];
  productType: ProductUpdate_productUpdate_product_productType;
  channelListings: ProductUpdate_productUpdate_product_channelListings[] | null;
  metadata: (ProductUpdate_productUpdate_product_metadata | null)[];
  privateMetadata: (ProductUpdate_productUpdate_product_privateMetadata | null)[];
  name: string;
  slug: string;
  description: any | null;
  seoTitle: string | null;
  seoDescription: string | null;
  rating: number | null;
  defaultVariant: ProductUpdate_productUpdate_product_defaultVariant | null;
  category: ProductUpdate_productUpdate_product_category | null;
  collections: (ProductUpdate_productUpdate_product_collections | null)[] | null;
  chargeTaxes: boolean;
  media: ProductUpdate_productUpdate_product_media[] | null;
  isAvailable: boolean | null;
  variants: (ProductUpdate_productUpdate_product_variants | null)[] | null;
  weight: ProductUpdate_productUpdate_product_weight | null;
  taxType: ProductUpdate_productUpdate_product_taxType | null;
}

export interface ProductUpdate_productUpdate {
  __typename: "ProductUpdate";
  errors: ProductUpdate_productUpdate_errors[];
  product: ProductUpdate_productUpdate_product | null;
}

export interface ProductUpdate {
  productUpdate: ProductUpdate_productUpdate | null;
}

export interface ProductUpdateVariables {
  id: string;
  input: ProductInput;
  firstValues?: number | null;
  afterValues?: string | null;
  lastValues?: number | null;
  beforeValues?: string | null;
}
