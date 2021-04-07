/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum, AttributeEntityTypeEnum, ProductMediaType, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ProductVariant
// ====================================================

export interface ProductVariant_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductVariant_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductVariant_selectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariant_selectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariant_selectionAttributes_attribute_values_file | null;
  reference: string | null;
}

export interface ProductVariant_selectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  values: (ProductVariant_selectionAttributes_attribute_values | null)[] | null;
}

export interface ProductVariant_selectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariant_selectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariant_selectionAttributes_values_file | null;
  reference: string | null;
}

export interface ProductVariant_selectionAttributes {
  __typename: "SelectedAttribute";
  attribute: ProductVariant_selectionAttributes_attribute;
  values: (ProductVariant_selectionAttributes_values | null)[];
}

export interface ProductVariant_nonSelectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariant_nonSelectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariant_nonSelectionAttributes_attribute_values_file | null;
  reference: string | null;
}

export interface ProductVariant_nonSelectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  values: (ProductVariant_nonSelectionAttributes_attribute_values | null)[] | null;
}

export interface ProductVariant_nonSelectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariant_nonSelectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariant_nonSelectionAttributes_values_file | null;
  reference: string | null;
}

export interface ProductVariant_nonSelectionAttributes {
  __typename: "SelectedAttribute";
  attribute: ProductVariant_nonSelectionAttributes_attribute;
  values: (ProductVariant_nonSelectionAttributes_values | null)[];
}

export interface ProductVariant_media {
  __typename: "ProductMedia";
  id: string;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface ProductVariant_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface ProductVariant_product_media {
  __typename: "ProductMedia";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface ProductVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface ProductVariant_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductVariant_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariant_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ProductVariant_product_channelListings_pricing_priceRange_start_net;
}

export interface ProductVariant_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariant_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ProductVariant_product_channelListings_pricing_priceRange_stop_net;
}

export interface ProductVariant_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ProductVariant_product_channelListings_pricing_priceRange_start | null;
  stop: ProductVariant_product_channelListings_pricing_priceRange_stop | null;
}

export interface ProductVariant_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ProductVariant_product_channelListings_pricing_priceRange | null;
}

export interface ProductVariant_product_channelListings {
  __typename: "ProductChannelListing";
  channel: ProductVariant_product_channelListings_channel;
  pricing: ProductVariant_product_channelListings_pricing | null;
}

export interface ProductVariant_product_variants_media {
  __typename: "ProductMedia";
  id: string;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface ProductVariant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  media: ProductVariant_product_variants_media[] | null;
}

export interface ProductVariant_product {
  __typename: "Product";
  id: string;
  defaultVariant: ProductVariant_product_defaultVariant | null;
  media: (ProductVariant_product_media | null)[] | null;
  name: string;
  thumbnail: ProductVariant_product_thumbnail | null;
  channelListings: ProductVariant_product_channelListings[] | null;
  variants: (ProductVariant_product_variants | null)[] | null;
}

export interface ProductVariant_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductVariant_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariant_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariant_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: ProductVariant_channelListings_channel;
  price: ProductVariant_channelListings_price | null;
  costPrice: ProductVariant_channelListings_costPrice | null;
}

export interface ProductVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductVariant_stocks_warehouse;
}

export interface ProductVariant_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductVariant {
  __typename: "ProductVariant";
  id: string;
  metadata: (ProductVariant_metadata | null)[];
  privateMetadata: (ProductVariant_privateMetadata | null)[];
  selectionAttributes: ProductVariant_selectionAttributes[];
  nonSelectionAttributes: ProductVariant_nonSelectionAttributes[];
  media: ProductVariant_media[] | null;
  name: string;
  product: ProductVariant_product;
  channelListings: ProductVariant_channelListings[] | null;
  sku: string;
  stocks: (ProductVariant_stocks | null)[] | null;
  trackInventory: boolean;
  weight: ProductVariant_weight | null;
}
