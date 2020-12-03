/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode, AttributeInputTypeEnum, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductImageUpdate
// ====================================================

export interface ProductImageUpdate_productImageUpdate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductImageUpdate_productImageUpdate_product_attributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductImageUpdate_productImageUpdate_product_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductImageUpdate_productImageUpdate_product_attributes_attribute_values_file | null;
}

export interface ProductImageUpdate_productImageUpdate_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (ProductImageUpdate_productImageUpdate_product_attributes_attribute_values | null)[] | null;
}

export interface ProductImageUpdate_productImageUpdate_product_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductImageUpdate_productImageUpdate_product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductImageUpdate_productImageUpdate_product_attributes_values_file | null;
}

export interface ProductImageUpdate_productImageUpdate_product_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductImageUpdate_productImageUpdate_product_attributes_attribute;
  values: (ProductImageUpdate_productImageUpdate_product_attributes_values | null)[];
}

export interface ProductImageUpdate_productImageUpdate_product_productType_variantAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductImageUpdate_productImageUpdate_product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductImageUpdate_productImageUpdate_product_productType_variantAttributes_values_file | null;
}

export interface ProductImageUpdate_productImageUpdate_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  values: (ProductImageUpdate_productImageUpdate_product_productType_variantAttributes_values | null)[] | null;
}

export interface ProductImageUpdate_productImageUpdate_product_productType_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductImageUpdate_productImageUpdate_product_productType {
  __typename: "ProductType";
  id: string;
  variantAttributes: (ProductImageUpdate_productImageUpdate_product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
  taxType: ProductImageUpdate_productImageUpdate_product_productType_taxType | null;
}

export interface ProductImageUpdate_productImageUpdate_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductImageUpdate_productImageUpdate_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductImageUpdate_productImageUpdate_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ProductImageUpdate_productImageUpdate_product_channelListings_pricing_priceRange_start_net;
}

export interface ProductImageUpdate_productImageUpdate_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductImageUpdate_productImageUpdate_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ProductImageUpdate_productImageUpdate_product_channelListings_pricing_priceRange_stop_net;
}

export interface ProductImageUpdate_productImageUpdate_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ProductImageUpdate_productImageUpdate_product_channelListings_pricing_priceRange_start | null;
  stop: ProductImageUpdate_productImageUpdate_product_channelListings_pricing_priceRange_stop | null;
}

export interface ProductImageUpdate_productImageUpdate_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ProductImageUpdate_productImageUpdate_product_channelListings_pricing_priceRange | null;
}

export interface ProductImageUpdate_productImageUpdate_product_channelListings {
  __typename: "ProductChannelListing";
  channel: ProductImageUpdate_productImageUpdate_product_channelListings_channel;
  pricing: ProductImageUpdate_productImageUpdate_product_channelListings_pricing | null;
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
}

export interface ProductImageUpdate_productImageUpdate_product_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductImageUpdate_productImageUpdate_product_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductImageUpdate_productImageUpdate_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface ProductImageUpdate_productImageUpdate_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface ProductImageUpdate_productImageUpdate_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface ProductImageUpdate_productImageUpdate_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductImageUpdate_productImageUpdate_product_variants_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductImageUpdate_productImageUpdate_product_variants_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductImageUpdate_productImageUpdate_product_variants_stocks_warehouse;
}

export interface ProductImageUpdate_productImageUpdate_product_variants_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductImageUpdate_productImageUpdate_product_variants_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductImageUpdate_productImageUpdate_product_variants_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductImageUpdate_productImageUpdate_product_variants_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: ProductImageUpdate_productImageUpdate_product_variants_channelListings_channel;
  price: ProductImageUpdate_productImageUpdate_product_variants_channelListings_price | null;
  costPrice: ProductImageUpdate_productImageUpdate_product_variants_channelListings_costPrice | null;
}

export interface ProductImageUpdate_productImageUpdate_product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  margin: number | null;
  stocks: (ProductImageUpdate_productImageUpdate_product_variants_stocks | null)[] | null;
  trackInventory: boolean;
  channelListings: ProductImageUpdate_productImageUpdate_product_variants_channelListings[] | null;
}

export interface ProductImageUpdate_productImageUpdate_product_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductImageUpdate_productImageUpdate_product_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductImageUpdate_productImageUpdate_product {
  __typename: "Product";
  id: string;
  attributes: ProductImageUpdate_productImageUpdate_product_attributes[];
  productType: ProductImageUpdate_productImageUpdate_product_productType;
  channelListings: ProductImageUpdate_productImageUpdate_product_channelListings[] | null;
  metadata: (ProductImageUpdate_productImageUpdate_product_metadata | null)[];
  privateMetadata: (ProductImageUpdate_productImageUpdate_product_privateMetadata | null)[];
  name: string;
  slug: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  rating: number | null;
  defaultVariant: ProductImageUpdate_productImageUpdate_product_defaultVariant | null;
  category: ProductImageUpdate_productImageUpdate_product_category | null;
  collections: (ProductImageUpdate_productImageUpdate_product_collections | null)[] | null;
  chargeTaxes: boolean;
  images: (ProductImageUpdate_productImageUpdate_product_images | null)[] | null;
  isAvailable: boolean | null;
  variants: (ProductImageUpdate_productImageUpdate_product_variants | null)[] | null;
  weight: ProductImageUpdate_productImageUpdate_product_weight | null;
  taxType: ProductImageUpdate_productImageUpdate_product_taxType | null;
}

export interface ProductImageUpdate_productImageUpdate {
  __typename: "ProductImageUpdate";
  errors: ProductImageUpdate_productImageUpdate_errors[];
  product: ProductImageUpdate_productImageUpdate_product | null;
}

export interface ProductImageUpdate {
  productImageUpdate: ProductImageUpdate_productImageUpdate | null;
}

export interface ProductImageUpdateVariables {
  id: string;
  alt: string;
}
