/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: Product
// ====================================================

export interface Product_attributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface Product_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: Product_attributes_attribute_values_file | null;
}

export interface Product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (Product_attributes_attribute_values | null)[] | null;
}

export interface Product_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface Product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: Product_attributes_values_file | null;
}

export interface Product_attributes {
  __typename: "SelectedAttribute";
  attribute: Product_attributes_attribute;
  values: (Product_attributes_values | null)[];
}

export interface Product_productType_variantAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface Product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: Product_productType_variantAttributes_values_file | null;
}

export interface Product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  values: (Product_productType_variantAttributes_values | null)[] | null;
}

export interface Product_productType_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface Product_productType {
  __typename: "ProductType";
  id: string;
  variantAttributes: (Product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
  taxType: Product_productType_taxType | null;
}

export interface Product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface Product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: Product_channelListings_pricing_priceRange_start_net;
}

export interface Product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: Product_channelListings_pricing_priceRange_stop_net;
}

export interface Product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: Product_channelListings_pricing_priceRange_start | null;
  stop: Product_channelListings_pricing_priceRange_stop | null;
}

export interface Product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: Product_channelListings_pricing_priceRange | null;
}

export interface Product_channelListings {
  __typename: "ProductChannelListing";
  channel: Product_channelListings_channel;
  pricing: Product_channelListings_pricing | null;
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
}

export interface Product_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface Product_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface Product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface Product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface Product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface Product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface Product_variants_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface Product_variants_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: Product_variants_stocks_warehouse;
}

export interface Product_variants_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface Product_variants_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Product_variants_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Product_variants_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: Product_variants_channelListings_channel;
  price: Product_variants_channelListings_price | null;
  costPrice: Product_variants_channelListings_costPrice | null;
}

export interface Product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  margin: number | null;
  stocks: (Product_variants_stocks | null)[] | null;
  trackInventory: boolean;
  channelListings: Product_variants_channelListings[] | null;
}

export interface Product_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface Product_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface Product {
  __typename: "Product";
  id: string;
  attributes: Product_attributes[];
  productType: Product_productType;
  channelListings: Product_channelListings[] | null;
  metadata: (Product_metadata | null)[];
  privateMetadata: (Product_privateMetadata | null)[];
  name: string;
  slug: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  rating: number | null;
  defaultVariant: Product_defaultVariant | null;
  category: Product_category | null;
  collections: (Product_collections | null)[] | null;
  chargeTaxes: boolean;
  images: (Product_images | null)[] | null;
  isAvailable: boolean | null;
  variants: (Product_variants | null)[] | null;
  weight: Product_weight | null;
  taxType: Product_taxType | null;
}
