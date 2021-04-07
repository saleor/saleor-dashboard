/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductErrorCode, AttributeInputTypeEnum, AttributeEntityTypeEnum, ProductMediaType, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductMediaUpdate
// ====================================================

export interface ProductMediaUpdate_productMediaUpdate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductMediaUpdate_productMediaUpdate_product_attributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductMediaUpdate_productMediaUpdate_product_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductMediaUpdate_productMediaUpdate_product_attributes_attribute_values_file | null;
  reference: string | null;
}

export interface ProductMediaUpdate_productMediaUpdate_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  values: (ProductMediaUpdate_productMediaUpdate_product_attributes_attribute_values | null)[] | null;
}

export interface ProductMediaUpdate_productMediaUpdate_product_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductMediaUpdate_productMediaUpdate_product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductMediaUpdate_productMediaUpdate_product_attributes_values_file | null;
  reference: string | null;
}

export interface ProductMediaUpdate_productMediaUpdate_product_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductMediaUpdate_productMediaUpdate_product_attributes_attribute;
  values: (ProductMediaUpdate_productMediaUpdate_product_attributes_values | null)[];
}

export interface ProductMediaUpdate_productMediaUpdate_product_productType_variantAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductMediaUpdate_productMediaUpdate_product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductMediaUpdate_productMediaUpdate_product_productType_variantAttributes_values_file | null;
  reference: string | null;
}

export interface ProductMediaUpdate_productMediaUpdate_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  values: (ProductMediaUpdate_productMediaUpdate_product_productType_variantAttributes_values | null)[] | null;
}

export interface ProductMediaUpdate_productMediaUpdate_product_productType_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductMediaUpdate_productMediaUpdate_product_productType {
  __typename: "ProductType";
  id: string;
  variantAttributes: (ProductMediaUpdate_productMediaUpdate_product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
  taxType: ProductMediaUpdate_productMediaUpdate_product_productType_taxType | null;
}

export interface ProductMediaUpdate_productMediaUpdate_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductMediaUpdate_productMediaUpdate_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductMediaUpdate_productMediaUpdate_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ProductMediaUpdate_productMediaUpdate_product_channelListings_pricing_priceRange_start_net;
}

export interface ProductMediaUpdate_productMediaUpdate_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductMediaUpdate_productMediaUpdate_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ProductMediaUpdate_productMediaUpdate_product_channelListings_pricing_priceRange_stop_net;
}

export interface ProductMediaUpdate_productMediaUpdate_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ProductMediaUpdate_productMediaUpdate_product_channelListings_pricing_priceRange_start | null;
  stop: ProductMediaUpdate_productMediaUpdate_product_channelListings_pricing_priceRange_stop | null;
}

export interface ProductMediaUpdate_productMediaUpdate_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ProductMediaUpdate_productMediaUpdate_product_channelListings_pricing_priceRange | null;
}

export interface ProductMediaUpdate_productMediaUpdate_product_channelListings {
  __typename: "ProductChannelListing";
  channel: ProductMediaUpdate_productMediaUpdate_product_channelListings_channel;
  pricing: ProductMediaUpdate_productMediaUpdate_product_channelListings_pricing | null;
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
}

export interface ProductMediaUpdate_productMediaUpdate_product_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductMediaUpdate_productMediaUpdate_product_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductMediaUpdate_productMediaUpdate_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface ProductMediaUpdate_productMediaUpdate_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface ProductMediaUpdate_productMediaUpdate_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface ProductMediaUpdate_productMediaUpdate_product_media {
  __typename: "ProductMedia";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface ProductMediaUpdate_productMediaUpdate_product_variants_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductMediaUpdate_productMediaUpdate_product_variants_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductMediaUpdate_productMediaUpdate_product_variants_stocks_warehouse;
}

export interface ProductMediaUpdate_productMediaUpdate_product_variants_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductMediaUpdate_productMediaUpdate_product_variants_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductMediaUpdate_productMediaUpdate_product_variants_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductMediaUpdate_productMediaUpdate_product_variants_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: ProductMediaUpdate_productMediaUpdate_product_variants_channelListings_channel;
  price: ProductMediaUpdate_productMediaUpdate_product_variants_channelListings_price | null;
  costPrice: ProductMediaUpdate_productMediaUpdate_product_variants_channelListings_costPrice | null;
}

export interface ProductMediaUpdate_productMediaUpdate_product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  margin: number | null;
  stocks: (ProductMediaUpdate_productMediaUpdate_product_variants_stocks | null)[] | null;
  trackInventory: boolean;
  channelListings: ProductMediaUpdate_productMediaUpdate_product_variants_channelListings[] | null;
}

export interface ProductMediaUpdate_productMediaUpdate_product_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductMediaUpdate_productMediaUpdate_product_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductMediaUpdate_productMediaUpdate_product {
  __typename: "Product";
  id: string;
  attributes: ProductMediaUpdate_productMediaUpdate_product_attributes[];
  productType: ProductMediaUpdate_productMediaUpdate_product_productType;
  channelListings: ProductMediaUpdate_productMediaUpdate_product_channelListings[] | null;
  metadata: (ProductMediaUpdate_productMediaUpdate_product_metadata | null)[];
  privateMetadata: (ProductMediaUpdate_productMediaUpdate_product_privateMetadata | null)[];
  name: string;
  slug: string;
  description: any | null;
  seoTitle: string | null;
  seoDescription: string | null;
  rating: number | null;
  defaultVariant: ProductMediaUpdate_productMediaUpdate_product_defaultVariant | null;
  category: ProductMediaUpdate_productMediaUpdate_product_category | null;
  collections: (ProductMediaUpdate_productMediaUpdate_product_collections | null)[] | null;
  chargeTaxes: boolean;
  media: (ProductMediaUpdate_productMediaUpdate_product_media | null)[] | null;
  isAvailable: boolean | null;
  variants: (ProductMediaUpdate_productMediaUpdate_product_variants | null)[] | null;
  weight: ProductMediaUpdate_productMediaUpdate_product_weight | null;
  taxType: ProductMediaUpdate_productMediaUpdate_product_taxType | null;
}

export interface ProductMediaUpdate_productMediaUpdate {
  __typename: "ProductMediaUpdate";
  errors: ProductMediaUpdate_productMediaUpdate_errors[];
  product: ProductMediaUpdate_productMediaUpdate_product | null;
}

export interface ProductMediaUpdate {
  productMediaUpdate: ProductMediaUpdate_productMediaUpdate | null;
}

export interface ProductMediaUpdateVariables {
  id: string;
  alt: string;
}
