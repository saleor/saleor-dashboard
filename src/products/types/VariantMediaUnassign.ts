/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductErrorCode, AttributeInputTypeEnum, AttributeEntityTypeEnum, ProductMediaType, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VariantMediaUnassign
// ====================================================

export interface VariantMediaUnassign_variantMediaUnassign_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_selectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_selectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantMediaUnassign_variantMediaUnassign_productVariant_selectionAttributes_attribute_values_file | null;
  reference: string | null;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_selectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  values: (VariantMediaUnassign_variantMediaUnassign_productVariant_selectionAttributes_attribute_values | null)[] | null;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_selectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_selectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantMediaUnassign_variantMediaUnassign_productVariant_selectionAttributes_values_file | null;
  reference: string | null;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_selectionAttributes {
  __typename: "SelectedAttribute";
  attribute: VariantMediaUnassign_variantMediaUnassign_productVariant_selectionAttributes_attribute;
  values: (VariantMediaUnassign_variantMediaUnassign_productVariant_selectionAttributes_values | null)[];
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_nonSelectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_nonSelectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantMediaUnassign_variantMediaUnassign_productVariant_nonSelectionAttributes_attribute_values_file | null;
  reference: string | null;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_nonSelectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  values: (VariantMediaUnassign_variantMediaUnassign_productVariant_nonSelectionAttributes_attribute_values | null)[] | null;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_nonSelectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_nonSelectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantMediaUnassign_variantMediaUnassign_productVariant_nonSelectionAttributes_values_file | null;
  reference: string | null;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_nonSelectionAttributes {
  __typename: "SelectedAttribute";
  attribute: VariantMediaUnassign_variantMediaUnassign_productVariant_nonSelectionAttributes_attribute;
  values: (VariantMediaUnassign_variantMediaUnassign_productVariant_nonSelectionAttributes_values | null)[];
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_media {
  __typename: "ProductMedia";
  id: string;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_product_media {
  __typename: "ProductMedia";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: VariantMediaUnassign_variantMediaUnassign_productVariant_product_channelListings_pricing_priceRange_start_net;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: VariantMediaUnassign_variantMediaUnassign_productVariant_product_channelListings_pricing_priceRange_stop_net;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: VariantMediaUnassign_variantMediaUnassign_productVariant_product_channelListings_pricing_priceRange_start | null;
  stop: VariantMediaUnassign_variantMediaUnassign_productVariant_product_channelListings_pricing_priceRange_stop | null;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: VariantMediaUnassign_variantMediaUnassign_productVariant_product_channelListings_pricing_priceRange | null;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_product_channelListings {
  __typename: "ProductChannelListing";
  channel: VariantMediaUnassign_variantMediaUnassign_productVariant_product_channelListings_channel;
  pricing: VariantMediaUnassign_variantMediaUnassign_productVariant_product_channelListings_pricing | null;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_product_variants_media {
  __typename: "ProductMedia";
  id: string;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  media: VariantMediaUnassign_variantMediaUnassign_productVariant_product_variants_media[] | null;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_product {
  __typename: "Product";
  id: string;
  defaultVariant: VariantMediaUnassign_variantMediaUnassign_productVariant_product_defaultVariant | null;
  media: VariantMediaUnassign_variantMediaUnassign_productVariant_product_media[] | null;
  name: string;
  thumbnail: VariantMediaUnassign_variantMediaUnassign_productVariant_product_thumbnail | null;
  channelListings: VariantMediaUnassign_variantMediaUnassign_productVariant_product_channelListings[] | null;
  variants: (VariantMediaUnassign_variantMediaUnassign_productVariant_product_variants | null)[] | null;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: VariantMediaUnassign_variantMediaUnassign_productVariant_channelListings_channel;
  price: VariantMediaUnassign_variantMediaUnassign_productVariant_channelListings_price | null;
  costPrice: VariantMediaUnassign_variantMediaUnassign_productVariant_channelListings_costPrice | null;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: VariantMediaUnassign_variantMediaUnassign_productVariant_stocks_warehouse;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant {
  __typename: "ProductVariant";
  id: string;
  metadata: (VariantMediaUnassign_variantMediaUnassign_productVariant_metadata | null)[];
  privateMetadata: (VariantMediaUnassign_variantMediaUnassign_productVariant_privateMetadata | null)[];
  selectionAttributes: VariantMediaUnassign_variantMediaUnassign_productVariant_selectionAttributes[];
  nonSelectionAttributes: VariantMediaUnassign_variantMediaUnassign_productVariant_nonSelectionAttributes[];
  media: VariantMediaUnassign_variantMediaUnassign_productVariant_media[] | null;
  name: string;
  product: VariantMediaUnassign_variantMediaUnassign_productVariant_product;
  channelListings: VariantMediaUnassign_variantMediaUnassign_productVariant_channelListings[] | null;
  sku: string;
  stocks: (VariantMediaUnassign_variantMediaUnassign_productVariant_stocks | null)[] | null;
  trackInventory: boolean;
  weight: VariantMediaUnassign_variantMediaUnassign_productVariant_weight | null;
}

export interface VariantMediaUnassign_variantMediaUnassign {
  __typename: "VariantMediaUnassign";
  errors: VariantMediaUnassign_variantMediaUnassign_errors[];
  productVariant: VariantMediaUnassign_variantMediaUnassign_productVariant | null;
}

export interface VariantMediaUnassign {
  variantMediaUnassign: VariantMediaUnassign_variantMediaUnassign | null;
}

export interface VariantMediaUnassignVariables {
  variantId: string;
  mediaId: string;
}
