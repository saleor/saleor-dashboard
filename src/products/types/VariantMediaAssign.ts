/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductErrorCode, AttributeInputTypeEnum, AttributeEntityTypeEnum, ProductMediaType, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VariantMediaAssign
// ====================================================

export interface VariantMediaAssign_variantMediaAssign_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_selectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_selectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantMediaAssign_variantMediaAssign_productVariant_selectionAttributes_attribute_values_file | null;
  reference: string | null;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_selectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  values: (VariantMediaAssign_variantMediaAssign_productVariant_selectionAttributes_attribute_values | null)[] | null;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_selectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_selectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantMediaAssign_variantMediaAssign_productVariant_selectionAttributes_values_file | null;
  reference: string | null;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_selectionAttributes {
  __typename: "SelectedAttribute";
  attribute: VariantMediaAssign_variantMediaAssign_productVariant_selectionAttributes_attribute;
  values: (VariantMediaAssign_variantMediaAssign_productVariant_selectionAttributes_values | null)[];
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_nonSelectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_nonSelectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantMediaAssign_variantMediaAssign_productVariant_nonSelectionAttributes_attribute_values_file | null;
  reference: string | null;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_nonSelectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  values: (VariantMediaAssign_variantMediaAssign_productVariant_nonSelectionAttributes_attribute_values | null)[] | null;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_nonSelectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_nonSelectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantMediaAssign_variantMediaAssign_productVariant_nonSelectionAttributes_values_file | null;
  reference: string | null;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_nonSelectionAttributes {
  __typename: "SelectedAttribute";
  attribute: VariantMediaAssign_variantMediaAssign_productVariant_nonSelectionAttributes_attribute;
  values: (VariantMediaAssign_variantMediaAssign_productVariant_nonSelectionAttributes_values | null)[];
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_media {
  __typename: "ProductMedia";
  id: string;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_product_media {
  __typename: "ProductMedia";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: VariantMediaAssign_variantMediaAssign_productVariant_product_channelListings_pricing_priceRange_start_net;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: VariantMediaAssign_variantMediaAssign_productVariant_product_channelListings_pricing_priceRange_stop_net;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: VariantMediaAssign_variantMediaAssign_productVariant_product_channelListings_pricing_priceRange_start | null;
  stop: VariantMediaAssign_variantMediaAssign_productVariant_product_channelListings_pricing_priceRange_stop | null;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: VariantMediaAssign_variantMediaAssign_productVariant_product_channelListings_pricing_priceRange | null;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_product_channelListings {
  __typename: "ProductChannelListing";
  channel: VariantMediaAssign_variantMediaAssign_productVariant_product_channelListings_channel;
  pricing: VariantMediaAssign_variantMediaAssign_productVariant_product_channelListings_pricing | null;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_product_variants_media {
  __typename: "ProductMedia";
  id: string;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  media: VariantMediaAssign_variantMediaAssign_productVariant_product_variants_media[] | null;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_product {
  __typename: "Product";
  id: string;
  defaultVariant: VariantMediaAssign_variantMediaAssign_productVariant_product_defaultVariant | null;
  media: VariantMediaAssign_variantMediaAssign_productVariant_product_media[] | null;
  name: string;
  thumbnail: VariantMediaAssign_variantMediaAssign_productVariant_product_thumbnail | null;
  channelListings: VariantMediaAssign_variantMediaAssign_productVariant_product_channelListings[] | null;
  variants: (VariantMediaAssign_variantMediaAssign_productVariant_product_variants | null)[] | null;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: VariantMediaAssign_variantMediaAssign_productVariant_channelListings_channel;
  price: VariantMediaAssign_variantMediaAssign_productVariant_channelListings_price | null;
  costPrice: VariantMediaAssign_variantMediaAssign_productVariant_channelListings_costPrice | null;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: VariantMediaAssign_variantMediaAssign_productVariant_stocks_warehouse;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant {
  __typename: "ProductVariant";
  id: string;
  metadata: (VariantMediaAssign_variantMediaAssign_productVariant_metadata | null)[];
  privateMetadata: (VariantMediaAssign_variantMediaAssign_productVariant_privateMetadata | null)[];
  selectionAttributes: VariantMediaAssign_variantMediaAssign_productVariant_selectionAttributes[];
  nonSelectionAttributes: VariantMediaAssign_variantMediaAssign_productVariant_nonSelectionAttributes[];
  media: VariantMediaAssign_variantMediaAssign_productVariant_media[] | null;
  name: string;
  product: VariantMediaAssign_variantMediaAssign_productVariant_product;
  channelListings: VariantMediaAssign_variantMediaAssign_productVariant_channelListings[] | null;
  sku: string;
  stocks: (VariantMediaAssign_variantMediaAssign_productVariant_stocks | null)[] | null;
  trackInventory: boolean;
  weight: VariantMediaAssign_variantMediaAssign_productVariant_weight | null;
}

export interface VariantMediaAssign_variantMediaAssign {
  __typename: "VariantMediaAssign";
  errors: VariantMediaAssign_variantMediaAssign_errors[];
  productVariant: VariantMediaAssign_variantMediaAssign_productVariant | null;
}

export interface VariantMediaAssign {
  variantMediaAssign: VariantMediaAssign_variantMediaAssign | null;
}

export interface VariantMediaAssignVariables {
  variantId: string;
  mediaId: string;
}
