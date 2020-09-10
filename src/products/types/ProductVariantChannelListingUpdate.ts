/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductVariantChannelListingAddInput, ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductVariantChannelListingUpdate
// ====================================================

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

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_pricing_priceUndiscounted_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_pricing_priceUndiscounted {
  __typename: "TaxedMoney";
  gross: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_pricing_priceUndiscounted_gross;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_pricing {
  __typename: "VariantPricingInfo";
  priceUndiscounted: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_pricing_priceUndiscounted | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_images {
  __typename: "ProductImage";
  id: string;
  url: string;
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
  images: (ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_images | null)[] | null;
  name: string;
  thumbnail: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_thumbnail | null;
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

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListing {
  __typename: "ProductVariantChannelListing";
  channel: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListing_channel;
  price: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListing_price | null;
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

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant {
  __typename: "ProductVariant";
  id: string;
  attributes: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_attributes[];
  costPrice: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_costPrice | null;
  pricing: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_pricing | null;
  images: (ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_images | null)[] | null;
  name: string;
  product: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product;
  channelListing: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListing[] | null;
  sku: string;
  stocks: (ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_stocks | null)[] | null;
  trackInventory: boolean;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_productChannelListingErrors {
  __typename: "ProductChannelListingError";
  field: string | null;
  message: string | null;
  code: ProductErrorCode;
  channels: string[] | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate {
  __typename: "ProductVariantChannelListingUpdate";
  variant: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant | null;
  productChannelListingErrors: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_productChannelListingErrors[];
}

export interface ProductVariantChannelListingUpdate {
  productVariantChannelListingUpdate: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate | null;
}

export interface ProductVariantChannelListingUpdateVariables {
  id: string;
  input: ProductVariantChannelListingAddInput[];
}
