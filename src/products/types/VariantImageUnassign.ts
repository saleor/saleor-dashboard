/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode, AttributeInputTypeEnum, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VariantImageUnassign
// ====================================================

export interface VariantImageUnassign_variantImageUnassign_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_selectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_selectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantImageUnassign_variantImageUnassign_productVariant_selectionAttributes_attribute_values_file | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_selectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (VariantImageUnassign_variantImageUnassign_productVariant_selectionAttributes_attribute_values | null)[] | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_selectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_selectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantImageUnassign_variantImageUnassign_productVariant_selectionAttributes_values_file | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_selectionAttributes {
  __typename: "SelectedAttribute";
  attribute: VariantImageUnassign_variantImageUnassign_productVariant_selectionAttributes_attribute;
  values: (VariantImageUnassign_variantImageUnassign_productVariant_selectionAttributes_values | null)[];
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_nonSelectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_nonSelectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantImageUnassign_variantImageUnassign_productVariant_nonSelectionAttributes_attribute_values_file | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_nonSelectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (VariantImageUnassign_variantImageUnassign_productVariant_nonSelectionAttributes_attribute_values | null)[] | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_nonSelectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_nonSelectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantImageUnassign_variantImageUnassign_productVariant_nonSelectionAttributes_values_file | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_nonSelectionAttributes {
  __typename: "SelectedAttribute";
  attribute: VariantImageUnassign_variantImageUnassign_productVariant_nonSelectionAttributes_attribute;
  values: (VariantImageUnassign_variantImageUnassign_productVariant_nonSelectionAttributes_values | null)[];
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: VariantImageUnassign_variantImageUnassign_productVariant_product_channelListings_pricing_priceRange_start_net;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: VariantImageUnassign_variantImageUnassign_productVariant_product_channelListings_pricing_priceRange_stop_net;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: VariantImageUnassign_variantImageUnassign_productVariant_product_channelListings_pricing_priceRange_start | null;
  stop: VariantImageUnassign_variantImageUnassign_productVariant_product_channelListings_pricing_priceRange_stop | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: VariantImageUnassign_variantImageUnassign_productVariant_product_channelListings_pricing_priceRange | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_product_channelListings {
  __typename: "ProductChannelListing";
  channel: VariantImageUnassign_variantImageUnassign_productVariant_product_channelListings_channel;
  pricing: VariantImageUnassign_variantImageUnassign_productVariant_product_channelListings_pricing | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_product_variants_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  images: (VariantImageUnassign_variantImageUnassign_productVariant_product_variants_images | null)[] | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_product {
  __typename: "Product";
  id: string;
  defaultVariant: VariantImageUnassign_variantImageUnassign_productVariant_product_defaultVariant | null;
  images: (VariantImageUnassign_variantImageUnassign_productVariant_product_images | null)[] | null;
  name: string;
  thumbnail: VariantImageUnassign_variantImageUnassign_productVariant_product_thumbnail | null;
  channelListings: VariantImageUnassign_variantImageUnassign_productVariant_product_channelListings[] | null;
  variants: (VariantImageUnassign_variantImageUnassign_productVariant_product_variants | null)[] | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: VariantImageUnassign_variantImageUnassign_productVariant_channelListings_channel;
  price: VariantImageUnassign_variantImageUnassign_productVariant_channelListings_price | null;
  costPrice: VariantImageUnassign_variantImageUnassign_productVariant_channelListings_costPrice | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: VariantImageUnassign_variantImageUnassign_productVariant_stocks_warehouse;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant {
  __typename: "ProductVariant";
  id: string;
  metadata: (VariantImageUnassign_variantImageUnassign_productVariant_metadata | null)[];
  privateMetadata: (VariantImageUnassign_variantImageUnassign_productVariant_privateMetadata | null)[];
  selectionAttributes: VariantImageUnassign_variantImageUnassign_productVariant_selectionAttributes[];
  nonSelectionAttributes: VariantImageUnassign_variantImageUnassign_productVariant_nonSelectionAttributes[];
  images: (VariantImageUnassign_variantImageUnassign_productVariant_images | null)[] | null;
  name: string;
  product: VariantImageUnassign_variantImageUnassign_productVariant_product;
  channelListings: VariantImageUnassign_variantImageUnassign_productVariant_channelListings[] | null;
  sku: string;
  stocks: (VariantImageUnassign_variantImageUnassign_productVariant_stocks | null)[] | null;
  trackInventory: boolean;
  weight: VariantImageUnassign_variantImageUnassign_productVariant_weight | null;
}

export interface VariantImageUnassign_variantImageUnassign {
  __typename: "VariantImageUnassign";
  errors: VariantImageUnassign_variantImageUnassign_errors[];
  productVariant: VariantImageUnassign_variantImageUnassign_productVariant | null;
}

export interface VariantImageUnassign {
  variantImageUnassign: VariantImageUnassign_variantImageUnassign | null;
}

export interface VariantImageUnassignVariables {
  variantId: string;
  imageId: string;
}
