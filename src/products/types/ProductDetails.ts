/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum, AttributeEntityTypeEnum, MeasurementUnitsEnum, ProductMediaType, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ProductDetails
// ====================================================

export interface ProductDetails_product_attributes_attribute_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface ProductDetails_product_attributes_attribute_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductDetails_product_attributes_attribute_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductDetails_product_attributes_attribute_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface ProductDetails_product_attributes_attribute_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: ProductDetails_product_attributes_attribute_choices_edges_node;
}

export interface ProductDetails_product_attributes_attribute_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: ProductDetails_product_attributes_attribute_choices_pageInfo;
  edges: ProductDetails_product_attributes_attribute_choices_edges[];
}

export interface ProductDetails_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  unit: MeasurementUnitsEnum | null;
  choices: ProductDetails_product_attributes_attribute_choices | null;
}

export interface ProductDetails_product_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductDetails_product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductDetails_product_attributes_values_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface ProductDetails_product_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductDetails_product_attributes_attribute;
  values: (ProductDetails_product_attributes_values | null)[];
}

export interface ProductDetails_product_productType_variantAttributes_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface ProductDetails_product_productType_variantAttributes_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductDetails_product_productType_variantAttributes_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductDetails_product_productType_variantAttributes_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface ProductDetails_product_productType_variantAttributes_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: ProductDetails_product_productType_variantAttributes_choices_edges_node;
}

export interface ProductDetails_product_productType_variantAttributes_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: ProductDetails_product_productType_variantAttributes_choices_pageInfo;
  edges: ProductDetails_product_productType_variantAttributes_choices_edges[];
}

export interface ProductDetails_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  choices: ProductDetails_product_productType_variantAttributes_choices | null;
}

export interface ProductDetails_product_productType_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductDetails_product_productType {
  __typename: "ProductType";
  id: string;
  variantAttributes: (ProductDetails_product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
  taxType: ProductDetails_product_productType_taxType | null;
}

export interface ProductDetails_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductDetails_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductDetails_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ProductDetails_product_channelListings_pricing_priceRange_start_net;
}

export interface ProductDetails_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductDetails_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ProductDetails_product_channelListings_pricing_priceRange_stop_net;
}

export interface ProductDetails_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ProductDetails_product_channelListings_pricing_priceRange_start | null;
  stop: ProductDetails_product_channelListings_pricing_priceRange_stop | null;
}

export interface ProductDetails_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ProductDetails_product_channelListings_pricing_priceRange | null;
}

export interface ProductDetails_product_channelListings {
  __typename: "ProductChannelListing";
  channel: ProductDetails_product_channelListings_channel;
  pricing: ProductDetails_product_channelListings_pricing | null;
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
}

export interface ProductDetails_product_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductDetails_product_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductDetails_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface ProductDetails_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface ProductDetails_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface ProductDetails_product_media {
  __typename: "ProductMedia";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface ProductDetails_product_variants_media {
  __typename: "ProductMedia";
  url: string;
}

export interface ProductDetails_product_variants_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductDetails_product_variants_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductDetails_product_variants_stocks_warehouse;
}

export interface ProductDetails_product_variants_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductDetails_product_variants_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductDetails_product_variants_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductDetails_product_variants_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: ProductDetails_product_variants_channelListings_channel;
  price: ProductDetails_product_variants_channelListings_price | null;
  costPrice: ProductDetails_product_variants_channelListings_costPrice | null;
}

export interface ProductDetails_product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  margin: number | null;
  media: ProductDetails_product_variants_media[] | null;
  stocks: (ProductDetails_product_variants_stocks | null)[] | null;
  trackInventory: boolean;
  channelListings: ProductDetails_product_variants_channelListings[] | null;
}

export interface ProductDetails_product_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductDetails_product_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductDetails_product {
  __typename: "Product";
  id: string;
  attributes: ProductDetails_product_attributes[];
  productType: ProductDetails_product_productType;
  channelListings: ProductDetails_product_channelListings[] | null;
  metadata: (ProductDetails_product_metadata | null)[];
  privateMetadata: (ProductDetails_product_privateMetadata | null)[];
  name: string;
  slug: string;
  description: any | null;
  seoTitle: string | null;
  seoDescription: string | null;
  rating: number | null;
  defaultVariant: ProductDetails_product_defaultVariant | null;
  category: ProductDetails_product_category | null;
  collections: (ProductDetails_product_collections | null)[] | null;
  chargeTaxes: boolean;
  media: ProductDetails_product_media[] | null;
  isAvailable: boolean | null;
  variants: (ProductDetails_product_variants | null)[] | null;
  weight: ProductDetails_product_weight | null;
  taxType: ProductDetails_product_taxType | null;
}

export interface ProductDetails_taxTypes {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductDetails {
  product: ProductDetails_product | null;
  taxTypes: (ProductDetails_taxTypes | null)[] | null;
}

export interface ProductDetailsVariables {
  id: string;
  channel?: string | null;
  firstValues?: number | null;
  afterValues?: string | null;
  lastValues?: number | null;
  beforeValues?: string | null;
}
