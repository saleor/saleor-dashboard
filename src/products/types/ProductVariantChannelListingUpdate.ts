/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductVariantChannelListingAddInput, WeightUnitsEnum, ProductErrorCode } from "./../../types/globalTypes";

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

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_attributes_attribute_values | null)[] | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_attributes_attribute;
  values: (ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_attributes_values | null)[];
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

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListing_discountedPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListing {
  __typename: "ProductChannelListing";
  channel: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListing_channel;
  discountedPrice: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListing_discountedPrice | null;
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
  channelListing: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListing[] | null;
  variants: (ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_variants | null)[] | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListing_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListing_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListing {
  __typename: "ProductVariantChannelListing";
  channel: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListing_channel;
  price: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListing_price | null;
  costPrice: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListing_costPrice | null;
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
  attributes: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_attributes[];
  images: (ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_images | null)[] | null;
  name: string;
  product: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product;
  channelListing: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListing[] | null;
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
