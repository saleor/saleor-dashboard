/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductVariantCreateInput, ProductErrorCode, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VariantCreate
// ====================================================

export interface VariantCreate_productVariantCreate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
  attributes: string[] | null;
}

export interface VariantCreate_productVariantCreate_productVariant_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VariantCreate_productVariantCreate_productVariant_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VariantCreate_productVariantCreate_productVariant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface VariantCreate_productVariantCreate_productVariant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (VariantCreate_productVariantCreate_productVariant_attributes_attribute_values | null)[] | null;
}

export interface VariantCreate_productVariantCreate_productVariant_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface VariantCreate_productVariantCreate_productVariant_attributes {
  __typename: "SelectedAttribute";
  attribute: VariantCreate_productVariantCreate_productVariant_attributes_attribute;
  values: (VariantCreate_productVariantCreate_productVariant_attributes_values | null)[];
}

export interface VariantCreate_productVariantCreate_productVariant_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface VariantCreate_productVariantCreate_productVariant_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface VariantCreate_productVariantCreate_productVariant_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface VariantCreate_productVariantCreate_productVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface VariantCreate_productVariantCreate_productVariant_product_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VariantCreate_productVariantCreate_productVariant_product_channelListing_discountedPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantCreate_productVariantCreate_productVariant_product_channelListing {
  __typename: "ProductChannelListing";
  channel: VariantCreate_productVariantCreate_productVariant_product_channelListing_channel;
  discountedPrice: VariantCreate_productVariantCreate_productVariant_product_channelListing_discountedPrice | null;
}

export interface VariantCreate_productVariantCreate_productVariant_product_variants_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface VariantCreate_productVariantCreate_productVariant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  images: (VariantCreate_productVariantCreate_productVariant_product_variants_images | null)[] | null;
}

export interface VariantCreate_productVariantCreate_productVariant_product {
  __typename: "Product";
  id: string;
  defaultVariant: VariantCreate_productVariantCreate_productVariant_product_defaultVariant | null;
  images: (VariantCreate_productVariantCreate_productVariant_product_images | null)[] | null;
  name: string;
  thumbnail: VariantCreate_productVariantCreate_productVariant_product_thumbnail | null;
  channelListing: VariantCreate_productVariantCreate_productVariant_product_channelListing[] | null;
  variants: (VariantCreate_productVariantCreate_productVariant_product_variants | null)[] | null;
}

export interface VariantCreate_productVariantCreate_productVariant_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VariantCreate_productVariantCreate_productVariant_channelListing_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantCreate_productVariantCreate_productVariant_channelListing_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantCreate_productVariantCreate_productVariant_channelListing {
  __typename: "ProductVariantChannelListing";
  channel: VariantCreate_productVariantCreate_productVariant_channelListing_channel;
  price: VariantCreate_productVariantCreate_productVariant_channelListing_price | null;
  costPrice: VariantCreate_productVariantCreate_productVariant_channelListing_costPrice | null;
}

export interface VariantCreate_productVariantCreate_productVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface VariantCreate_productVariantCreate_productVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: VariantCreate_productVariantCreate_productVariant_stocks_warehouse;
}

export interface VariantCreate_productVariantCreate_productVariant_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface VariantCreate_productVariantCreate_productVariant {
  __typename: "ProductVariant";
  id: string;
  metadata: (VariantCreate_productVariantCreate_productVariant_metadata | null)[];
  privateMetadata: (VariantCreate_productVariantCreate_productVariant_privateMetadata | null)[];
  attributes: VariantCreate_productVariantCreate_productVariant_attributes[];
  images: (VariantCreate_productVariantCreate_productVariant_images | null)[] | null;
  name: string;
  product: VariantCreate_productVariantCreate_productVariant_product;
  channelListing: VariantCreate_productVariantCreate_productVariant_channelListing[] | null;
  sku: string;
  stocks: (VariantCreate_productVariantCreate_productVariant_stocks | null)[] | null;
  trackInventory: boolean;
  weight: VariantCreate_productVariantCreate_productVariant_weight | null;
}

export interface VariantCreate_productVariantCreate {
  __typename: "ProductVariantCreate";
  errors: VariantCreate_productVariantCreate_errors[];
  productVariant: VariantCreate_productVariantCreate_productVariant | null;
}

export interface VariantCreate {
  productVariantCreate: VariantCreate_productVariantCreate | null;
}

export interface VariantCreateVariables {
  input: ProductVariantCreateInput;
}
