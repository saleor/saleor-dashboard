/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode, AttributeInputTypeEnum, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VariantImageAssign
// ====================================================

export interface VariantImageAssign_variantImageAssign_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VariantImageAssign_variantImageAssign_productVariant_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VariantImageAssign_variantImageAssign_productVariant_selectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_selectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantImageAssign_variantImageAssign_productVariant_selectionAttributes_attribute_values_file | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_selectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (VariantImageAssign_variantImageAssign_productVariant_selectionAttributes_attribute_values | null)[] | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_selectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_selectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantImageAssign_variantImageAssign_productVariant_selectionAttributes_values_file | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_selectionAttributes {
  __typename: "SelectedAttribute";
  attribute: VariantImageAssign_variantImageAssign_productVariant_selectionAttributes_attribute;
  values: (VariantImageAssign_variantImageAssign_productVariant_selectionAttributes_values | null)[];
}

export interface VariantImageAssign_variantImageAssign_productVariant_nonSelectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_nonSelectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantImageAssign_variantImageAssign_productVariant_nonSelectionAttributes_attribute_values_file | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_nonSelectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (VariantImageAssign_variantImageAssign_productVariant_nonSelectionAttributes_attribute_values | null)[] | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_nonSelectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_nonSelectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: VariantImageAssign_variantImageAssign_productVariant_nonSelectionAttributes_values_file | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_nonSelectionAttributes {
  __typename: "SelectedAttribute";
  attribute: VariantImageAssign_variantImageAssign_productVariant_nonSelectionAttributes_attribute;
  values: (VariantImageAssign_variantImageAssign_productVariant_nonSelectionAttributes_values | null)[];
}

export interface VariantImageAssign_variantImageAssign_productVariant_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface VariantImageAssign_variantImageAssign_productVariant_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface VariantImageAssign_variantImageAssign_productVariant_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface VariantImageAssign_variantImageAssign_productVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface VariantImageAssign_variantImageAssign_productVariant_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VariantImageAssign_variantImageAssign_productVariant_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantImageAssign_variantImageAssign_productVariant_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: VariantImageAssign_variantImageAssign_productVariant_product_channelListings_pricing_priceRange_start_net;
}

export interface VariantImageAssign_variantImageAssign_productVariant_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantImageAssign_variantImageAssign_productVariant_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: VariantImageAssign_variantImageAssign_productVariant_product_channelListings_pricing_priceRange_stop_net;
}

export interface VariantImageAssign_variantImageAssign_productVariant_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: VariantImageAssign_variantImageAssign_productVariant_product_channelListings_pricing_priceRange_start | null;
  stop: VariantImageAssign_variantImageAssign_productVariant_product_channelListings_pricing_priceRange_stop | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: VariantImageAssign_variantImageAssign_productVariant_product_channelListings_pricing_priceRange | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_product_channelListings {
  __typename: "ProductChannelListing";
  channel: VariantImageAssign_variantImageAssign_productVariant_product_channelListings_channel;
  pricing: VariantImageAssign_variantImageAssign_productVariant_product_channelListings_pricing | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_product_variants_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface VariantImageAssign_variantImageAssign_productVariant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  images: (VariantImageAssign_variantImageAssign_productVariant_product_variants_images | null)[] | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_product {
  __typename: "Product";
  id: string;
  defaultVariant: VariantImageAssign_variantImageAssign_productVariant_product_defaultVariant | null;
  images: (VariantImageAssign_variantImageAssign_productVariant_product_images | null)[] | null;
  name: string;
  thumbnail: VariantImageAssign_variantImageAssign_productVariant_product_thumbnail | null;
  channelListings: VariantImageAssign_variantImageAssign_productVariant_product_channelListings[] | null;
  variants: (VariantImageAssign_variantImageAssign_productVariant_product_variants | null)[] | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VariantImageAssign_variantImageAssign_productVariant_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantImageAssign_variantImageAssign_productVariant_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantImageAssign_variantImageAssign_productVariant_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: VariantImageAssign_variantImageAssign_productVariant_channelListings_channel;
  price: VariantImageAssign_variantImageAssign_productVariant_channelListings_price | null;
  costPrice: VariantImageAssign_variantImageAssign_productVariant_channelListings_costPrice | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface VariantImageAssign_variantImageAssign_productVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: VariantImageAssign_variantImageAssign_productVariant_stocks_warehouse;
}

export interface VariantImageAssign_variantImageAssign_productVariant_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface VariantImageAssign_variantImageAssign_productVariant {
  __typename: "ProductVariant";
  id: string;
  metadata: (VariantImageAssign_variantImageAssign_productVariant_metadata | null)[];
  privateMetadata: (VariantImageAssign_variantImageAssign_productVariant_privateMetadata | null)[];
  selectionAttributes: VariantImageAssign_variantImageAssign_productVariant_selectionAttributes[];
  nonSelectionAttributes: VariantImageAssign_variantImageAssign_productVariant_nonSelectionAttributes[];
  images: (VariantImageAssign_variantImageAssign_productVariant_images | null)[] | null;
  name: string;
  product: VariantImageAssign_variantImageAssign_productVariant_product;
  channelListings: VariantImageAssign_variantImageAssign_productVariant_channelListings[] | null;
  sku: string;
  stocks: (VariantImageAssign_variantImageAssign_productVariant_stocks | null)[] | null;
  trackInventory: boolean;
  weight: VariantImageAssign_variantImageAssign_productVariant_weight | null;
}

export interface VariantImageAssign_variantImageAssign {
  __typename: "VariantImageAssign";
  errors: VariantImageAssign_variantImageAssign_errors[];
  productVariant: VariantImageAssign_variantImageAssign_productVariant | null;
}

export interface VariantImageAssign {
  variantImageAssign: VariantImageAssign_variantImageAssign | null;
}

export interface VariantImageAssignVariables {
  variantId: string;
  imageId: string;
}
