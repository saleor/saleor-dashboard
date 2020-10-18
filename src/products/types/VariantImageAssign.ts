/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode, WeightUnitsEnum } from "./../../types/globalTypes";

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

export interface VariantImageAssign_variantImageAssign_productVariant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (VariantImageAssign_variantImageAssign_productVariant_attributes_attribute_values | null)[] | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_attributes {
  __typename: "SelectedAttribute";
  attribute: VariantImageAssign_variantImageAssign_productVariant_attributes_attribute;
  values: (VariantImageAssign_variantImageAssign_productVariant_attributes_values | null)[];
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

export interface VariantImageAssign_variantImageAssign_productVariant_product_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VariantImageAssign_variantImageAssign_productVariant_product_channelListing_discountedPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantImageAssign_variantImageAssign_productVariant_product_channelListing {
  __typename: "ProductChannelListing";
  channel: VariantImageAssign_variantImageAssign_productVariant_product_channelListing_channel;
  discountedPrice: VariantImageAssign_variantImageAssign_productVariant_product_channelListing_discountedPrice | null;
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
  channelListing: VariantImageAssign_variantImageAssign_productVariant_product_channelListing[] | null;
  variants: (VariantImageAssign_variantImageAssign_productVariant_product_variants | null)[] | null;
}

export interface VariantImageAssign_variantImageAssign_productVariant_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VariantImageAssign_variantImageAssign_productVariant_channelListing_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantImageAssign_variantImageAssign_productVariant_channelListing_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantImageAssign_variantImageAssign_productVariant_channelListing {
  __typename: "ProductVariantChannelListing";
  channel: VariantImageAssign_variantImageAssign_productVariant_channelListing_channel;
  price: VariantImageAssign_variantImageAssign_productVariant_channelListing_price | null;
  costPrice: VariantImageAssign_variantImageAssign_productVariant_channelListing_costPrice | null;
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
  attributes: VariantImageAssign_variantImageAssign_productVariant_attributes[];
  images: (VariantImageAssign_variantImageAssign_productVariant_images | null)[] | null;
  name: string;
  product: VariantImageAssign_variantImageAssign_productVariant_product;
  channelListing: VariantImageAssign_variantImageAssign_productVariant_channelListing[] | null;
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
