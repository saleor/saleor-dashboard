/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ProductVariantDetails
// ====================================================

export interface ProductVariantDetails_productVariant_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductVariantDetails_productVariant_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductVariantDetails_productVariant_selectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantDetails_productVariant_selectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantDetails_productVariant_selectionAttributes_attribute_values_file | null;
}

export interface ProductVariantDetails_productVariant_selectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (ProductVariantDetails_productVariant_selectionAttributes_attribute_values | null)[] | null;
}

export interface ProductVariantDetails_productVariant_selectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantDetails_productVariant_selectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantDetails_productVariant_selectionAttributes_values_file | null;
}

export interface ProductVariantDetails_productVariant_selectionAttributes {
  __typename: "SelectedAttribute";
  attribute: ProductVariantDetails_productVariant_selectionAttributes_attribute;
  values: (ProductVariantDetails_productVariant_selectionAttributes_values | null)[];
}

export interface ProductVariantDetails_productVariant_nonSelectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantDetails_productVariant_nonSelectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantDetails_productVariant_nonSelectionAttributes_attribute_values_file | null;
}

export interface ProductVariantDetails_productVariant_nonSelectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (ProductVariantDetails_productVariant_nonSelectionAttributes_attribute_values | null)[] | null;
}

export interface ProductVariantDetails_productVariant_nonSelectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantDetails_productVariant_nonSelectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantDetails_productVariant_nonSelectionAttributes_values_file | null;
}

export interface ProductVariantDetails_productVariant_nonSelectionAttributes {
  __typename: "SelectedAttribute";
  attribute: ProductVariantDetails_productVariant_nonSelectionAttributes_attribute;
  values: (ProductVariantDetails_productVariant_nonSelectionAttributes_values | null)[];
}

export interface ProductVariantDetails_productVariant_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface ProductVariantDetails_productVariant_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface ProductVariantDetails_productVariant_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductVariantDetails_productVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface ProductVariantDetails_productVariant_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductVariantDetails_productVariant_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantDetails_productVariant_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ProductVariantDetails_productVariant_product_channelListings_pricing_priceRange_start_net;
}

export interface ProductVariantDetails_productVariant_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantDetails_productVariant_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ProductVariantDetails_productVariant_product_channelListings_pricing_priceRange_stop_net;
}

export interface ProductVariantDetails_productVariant_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ProductVariantDetails_productVariant_product_channelListings_pricing_priceRange_start | null;
  stop: ProductVariantDetails_productVariant_product_channelListings_pricing_priceRange_stop | null;
}

export interface ProductVariantDetails_productVariant_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ProductVariantDetails_productVariant_product_channelListings_pricing_priceRange | null;
}

export interface ProductVariantDetails_productVariant_product_channelListings {
  __typename: "ProductChannelListing";
  channel: ProductVariantDetails_productVariant_product_channelListings_channel;
  pricing: ProductVariantDetails_productVariant_product_channelListings_pricing | null;
}

export interface ProductVariantDetails_productVariant_product_variants_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface ProductVariantDetails_productVariant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  images: (ProductVariantDetails_productVariant_product_variants_images | null)[] | null;
}

export interface ProductVariantDetails_productVariant_product {
  __typename: "Product";
  id: string;
  defaultVariant: ProductVariantDetails_productVariant_product_defaultVariant | null;
  images: (ProductVariantDetails_productVariant_product_images | null)[] | null;
  name: string;
  thumbnail: ProductVariantDetails_productVariant_product_thumbnail | null;
  channelListings: ProductVariantDetails_productVariant_product_channelListings[] | null;
  variants: (ProductVariantDetails_productVariant_product_variants | null)[] | null;
}

export interface ProductVariantDetails_productVariant_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductVariantDetails_productVariant_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantDetails_productVariant_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantDetails_productVariant_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: ProductVariantDetails_productVariant_channelListings_channel;
  price: ProductVariantDetails_productVariant_channelListings_price | null;
  costPrice: ProductVariantDetails_productVariant_channelListings_costPrice | null;
}

export interface ProductVariantDetails_productVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductVariantDetails_productVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductVariantDetails_productVariant_stocks_warehouse;
}

export interface ProductVariantDetails_productVariant_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductVariantDetails_productVariant {
  __typename: "ProductVariant";
  id: string;
  metadata: (ProductVariantDetails_productVariant_metadata | null)[];
  privateMetadata: (ProductVariantDetails_productVariant_privateMetadata | null)[];
  selectionAttributes: ProductVariantDetails_productVariant_selectionAttributes[];
  nonSelectionAttributes: ProductVariantDetails_productVariant_nonSelectionAttributes[];
  images: (ProductVariantDetails_productVariant_images | null)[] | null;
  name: string;
  product: ProductVariantDetails_productVariant_product;
  channelListings: ProductVariantDetails_productVariant_channelListings[] | null;
  sku: string;
  stocks: (ProductVariantDetails_productVariant_stocks | null)[] | null;
  trackInventory: boolean;
  weight: ProductVariantDetails_productVariant_weight | null;
}

export interface ProductVariantDetails {
  productVariant: ProductVariantDetails_productVariant | null;
}

export interface ProductVariantDetailsVariables {
  id: string;
}
