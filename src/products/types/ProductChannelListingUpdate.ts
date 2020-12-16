/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductChannelListingUpdateInput, AttributeInputTypeEnum, WeightUnitsEnum, ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductChannelListingUpdate
// ====================================================

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_attributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductChannelListingUpdate_productChannelListingUpdate_product_attributes_attribute_values_file | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (ProductChannelListingUpdate_productChannelListingUpdate_product_attributes_attribute_values | null)[] | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductChannelListingUpdate_productChannelListingUpdate_product_attributes_values_file | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductChannelListingUpdate_productChannelListingUpdate_product_attributes_attribute;
  values: (ProductChannelListingUpdate_productChannelListingUpdate_product_attributes_values | null)[];
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_productType_variantAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductChannelListingUpdate_productChannelListingUpdate_product_productType_variantAttributes_values_file | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  values: (ProductChannelListingUpdate_productChannelListingUpdate_product_productType_variantAttributes_values | null)[] | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_productType_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_productType {
  __typename: "ProductType";
  id: string;
  variantAttributes: (ProductChannelListingUpdate_productChannelListingUpdate_product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
  taxType: ProductChannelListingUpdate_productChannelListingUpdate_product_productType_taxType | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ProductChannelListingUpdate_productChannelListingUpdate_product_channelListings_pricing_priceRange_start_net;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ProductChannelListingUpdate_productChannelListingUpdate_product_channelListings_pricing_priceRange_stop_net;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ProductChannelListingUpdate_productChannelListingUpdate_product_channelListings_pricing_priceRange_start | null;
  stop: ProductChannelListingUpdate_productChannelListingUpdate_product_channelListings_pricing_priceRange_stop | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ProductChannelListingUpdate_productChannelListingUpdate_product_channelListings_pricing_priceRange | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_channelListings {
  __typename: "ProductChannelListing";
  channel: ProductChannelListingUpdate_productChannelListingUpdate_product_channelListings_channel;
  pricing: ProductChannelListingUpdate_productChannelListingUpdate_product_channelListings_pricing | null;
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_variants_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_variants_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductChannelListingUpdate_productChannelListingUpdate_product_variants_stocks_warehouse;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_variants_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_variants_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_variants_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_variants_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: ProductChannelListingUpdate_productChannelListingUpdate_product_variants_channelListings_channel;
  price: ProductChannelListingUpdate_productChannelListingUpdate_product_variants_channelListings_price | null;
  costPrice: ProductChannelListingUpdate_productChannelListingUpdate_product_variants_channelListings_costPrice | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  margin: number | null;
  stocks: (ProductChannelListingUpdate_productChannelListingUpdate_product_variants_stocks | null)[] | null;
  trackInventory: boolean;
  channelListings: ProductChannelListingUpdate_productChannelListingUpdate_product_variants_channelListings[] | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product {
  __typename: "Product";
  id: string;
  attributes: ProductChannelListingUpdate_productChannelListingUpdate_product_attributes[];
  productType: ProductChannelListingUpdate_productChannelListingUpdate_product_productType;
  channelListings: ProductChannelListingUpdate_productChannelListingUpdate_product_channelListings[] | null;
  metadata: (ProductChannelListingUpdate_productChannelListingUpdate_product_metadata | null)[];
  privateMetadata: (ProductChannelListingUpdate_productChannelListingUpdate_product_privateMetadata | null)[];
  name: string;
  slug: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  rating: number | null;
  defaultVariant: ProductChannelListingUpdate_productChannelListingUpdate_product_defaultVariant | null;
  category: ProductChannelListingUpdate_productChannelListingUpdate_product_category | null;
  collections: (ProductChannelListingUpdate_productChannelListingUpdate_product_collections | null)[] | null;
  chargeTaxes: boolean;
  images: (ProductChannelListingUpdate_productChannelListingUpdate_product_images | null)[] | null;
  isAvailable: boolean | null;
  variants: (ProductChannelListingUpdate_productChannelListingUpdate_product_variants | null)[] | null;
  weight: ProductChannelListingUpdate_productChannelListingUpdate_product_weight | null;
  taxType: ProductChannelListingUpdate_productChannelListingUpdate_product_taxType | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_errors {
  __typename: "ProductChannelListingError";
  code: ProductErrorCode;
  field: string | null;
  message: string | null;
  channels: string[] | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate {
  __typename: "ProductChannelListingUpdate";
  product: ProductChannelListingUpdate_productChannelListingUpdate_product | null;
  errors: ProductChannelListingUpdate_productChannelListingUpdate_errors[];
}

export interface ProductChannelListingUpdate {
  productChannelListingUpdate: ProductChannelListingUpdate_productChannelListingUpdate | null;
}

export interface ProductChannelListingUpdateVariables {
  id: string;
  input: ProductChannelListingUpdateInput;
}
