/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductVariantChannelListingAddInput, AttributeInputTypeEnum, WeightUnitsEnum, ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductVariantChannelListingUpdate
// ====================================================

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_selectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_selectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_selectionAttributes_attribute_values_file | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_selectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_selectionAttributes_attribute_values | null)[] | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_selectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_selectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_selectionAttributes_values_file | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_selectionAttributes {
  __typename: "SelectedAttribute";
  attribute: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_selectionAttributes_attribute;
  values: (ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_selectionAttributes_values | null)[];
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_nonSelectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_nonSelectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_nonSelectionAttributes_attribute_values_file | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_nonSelectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_nonSelectionAttributes_attribute_values | null)[] | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_nonSelectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_nonSelectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_nonSelectionAttributes_values_file | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_nonSelectionAttributes {
  __typename: "SelectedAttribute";
  attribute: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_nonSelectionAttributes_attribute;
  values: (ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_nonSelectionAttributes_values | null)[];
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing_priceRange_start_net;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing_priceRange_stop_net;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing_priceRange_start | null;
  stop: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing_priceRange_stop | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing_priceRange | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings {
  __typename: "ProductChannelListing";
  channel: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_channel;
  pricing: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_variants_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  images: (ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_variants_images | null)[] | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product {
  __typename: "Product";
  id: string;
  defaultVariant: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_defaultVariant | null;
  images: (ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_images | null)[] | null;
  name: string;
  thumbnail: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_thumbnail | null;
  channelListings: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings[] | null;
  variants: (ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_variants | null)[] | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListings_channel;
  price: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListings_price | null;
  costPrice: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListings_costPrice | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_stocks_warehouse;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant {
  __typename: "ProductVariant";
  id: string;
  metadata: (ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_metadata | null)[];
  privateMetadata: (ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_privateMetadata | null)[];
  selectionAttributes: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_selectionAttributes[];
  nonSelectionAttributes: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_nonSelectionAttributes[];
  images: (ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_images | null)[] | null;
  name: string;
  product: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product;
  channelListings: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListings[] | null;
  sku: string;
  stocks: (ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_stocks | null)[] | null;
  trackInventory: boolean;
  weight: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_weight | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_errors {
  __typename: "ProductChannelListingError";
  code: ProductErrorCode;
  field: string | null;
  message: string | null;
  channels: string[] | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate {
  __typename: "ProductVariantChannelListingUpdate";
  variant: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant | null;
  errors: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_errors[];
}

export interface ProductVariantChannelListingUpdate {
  productVariantChannelListingUpdate: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate | null;
}

export interface ProductVariantChannelListingUpdateVariables {
  id: string;
  input: ProductVariantChannelListingAddInput[];
}
