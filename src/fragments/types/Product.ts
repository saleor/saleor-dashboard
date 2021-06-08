/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum, AttributeEntityTypeEnum, MeasurementUnitsEnum, ProductMediaType, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: Product
// ====================================================

export interface Product_attributes_attribute_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface Product_attributes_attribute_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface Product_attributes_attribute_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: Product_attributes_attribute_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
}

export interface Product_attributes_attribute_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: Product_attributes_attribute_choices_edges_node;
}

export interface Product_attributes_attribute_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: Product_attributes_attribute_choices_pageInfo;
  edges: Product_attributes_attribute_choices_edges[];
}

export interface Product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  unit: MeasurementUnitsEnum | null;
  choices: Product_attributes_attribute_choices | null;
}

export interface Product_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface Product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: Product_attributes_values_file | null;
  reference: string | null;
  richText: any | null;
}

export interface Product_attributes {
  __typename: "SelectedAttribute";
  attribute: Product_attributes_attribute;
  values: (Product_attributes_values | null)[];
}

export interface Product_productType_variantAttributes_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface Product_productType_variantAttributes_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface Product_productType_variantAttributes_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: Product_productType_variantAttributes_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
}

export interface Product_productType_variantAttributes_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: Product_productType_variantAttributes_choices_edges_node;
}

export interface Product_productType_variantAttributes_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: Product_productType_variantAttributes_choices_pageInfo;
  edges: Product_productType_variantAttributes_choices_edges[];
}

export interface Product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  choices: Product_productType_variantAttributes_choices | null;
}

export interface Product_productType_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface Product_productType {
  __typename: "ProductType";
  id: string;
  variantAttributes: (Product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
  taxType: Product_productType_taxType | null;
}

export interface Product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface Product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: Product_channelListings_pricing_priceRange_start_net;
}

export interface Product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: Product_channelListings_pricing_priceRange_stop_net;
}

export interface Product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: Product_channelListings_pricing_priceRange_start | null;
  stop: Product_channelListings_pricing_priceRange_stop | null;
}

export interface Product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: Product_channelListings_pricing_priceRange | null;
}

export interface Product_channelListings {
  __typename: "ProductChannelListing";
  channel: Product_channelListings_channel;
  pricing: Product_channelListings_pricing | null;
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
}

export interface Product_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface Product_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface Product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface Product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface Product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface Product_media {
  __typename: "ProductMedia";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface Product_variants_media {
  __typename: "ProductMedia";
  url: string;
}

export interface Product_variants_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface Product_variants_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: Product_variants_stocks_warehouse;
}

export interface Product_variants_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface Product_variants_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Product_variants_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Product_variants_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: Product_variants_channelListings_channel;
  price: Product_variants_channelListings_price | null;
  costPrice: Product_variants_channelListings_costPrice | null;
}

export interface Product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  margin: number | null;
  media: Product_variants_media[] | null;
  stocks: (Product_variants_stocks | null)[] | null;
  trackInventory: boolean;
  channelListings: Product_variants_channelListings[] | null;
}

export interface Product_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface Product_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface Product {
  __typename: "Product";
  id: string;
  attributes: Product_attributes[];
  productType: Product_productType;
  channelListings: Product_channelListings[] | null;
  metadata: (Product_metadata | null)[];
  privateMetadata: (Product_privateMetadata | null)[];
  name: string;
  slug: string;
  description: any | null;
  seoTitle: string | null;
  seoDescription: string | null;
  rating: number | null;
  defaultVariant: Product_defaultVariant | null;
  category: Product_category | null;
  collections: (Product_collections | null)[] | null;
  chargeTaxes: boolean;
  media: Product_media[] | null;
  isAvailable: boolean | null;
  variants: (Product_variants | null)[] | null;
  weight: Product_weight | null;
  taxType: Product_taxType | null;
}
