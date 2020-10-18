/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WeightUnitsEnum } from "./../../types/globalTypes";

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

export interface ProductVariantDetails_productVariant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductVariantDetails_productVariant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (ProductVariantDetails_productVariant_attributes_attribute_values | null)[] | null;
}

export interface ProductVariantDetails_productVariant_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductVariantDetails_productVariant_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductVariantDetails_productVariant_attributes_attribute;
  values: (ProductVariantDetails_productVariant_attributes_values | null)[];
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

export interface ProductVariantDetails_productVariant_product_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductVariantDetails_productVariant_product_channelListing_discountedPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantDetails_productVariant_product_channelListing {
  __typename: "ProductChannelListing";
  channel: ProductVariantDetails_productVariant_product_channelListing_channel;
  discountedPrice: ProductVariantDetails_productVariant_product_channelListing_discountedPrice | null;
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
  channelListing: ProductVariantDetails_productVariant_product_channelListing[] | null;
  variants: (ProductVariantDetails_productVariant_product_variants | null)[] | null;
}

export interface ProductVariantDetails_productVariant_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductVariantDetails_productVariant_channelListing_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantDetails_productVariant_channelListing_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantDetails_productVariant_channelListing {
  __typename: "ProductVariantChannelListing";
  channel: ProductVariantDetails_productVariant_channelListing_channel;
  price: ProductVariantDetails_productVariant_channelListing_price | null;
  costPrice: ProductVariantDetails_productVariant_channelListing_costPrice | null;
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
  attributes: ProductVariantDetails_productVariant_attributes[];
  images: (ProductVariantDetails_productVariant_images | null)[] | null;
  name: string;
  product: ProductVariantDetails_productVariant_product;
  channelListing: ProductVariantDetails_productVariant_channelListing[] | null;
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
