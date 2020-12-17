/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ReorderInput, ProductErrorCode, AttributeInputTypeEnum, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductVariantReorder
// ====================================================

export interface ProductVariantReorder_productVariantReorder_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductVariantReorder_productVariantReorder_product_attributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantReorder_productVariantReorder_product_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantReorder_productVariantReorder_product_attributes_attribute_values_file | null;
}

export interface ProductVariantReorder_productVariantReorder_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (ProductVariantReorder_productVariantReorder_product_attributes_attribute_values | null)[] | null;
}

export interface ProductVariantReorder_productVariantReorder_product_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantReorder_productVariantReorder_product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantReorder_productVariantReorder_product_attributes_values_file | null;
}

export interface ProductVariantReorder_productVariantReorder_product_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductVariantReorder_productVariantReorder_product_attributes_attribute;
  values: (ProductVariantReorder_productVariantReorder_product_attributes_values | null)[];
}

export interface ProductVariantReorder_productVariantReorder_product_productType_variantAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantReorder_productVariantReorder_product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantReorder_productVariantReorder_product_productType_variantAttributes_values_file | null;
}

export interface ProductVariantReorder_productVariantReorder_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  values: (ProductVariantReorder_productVariantReorder_product_productType_variantAttributes_values | null)[] | null;
}

export interface ProductVariantReorder_productVariantReorder_product_productType_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductVariantReorder_productVariantReorder_product_productType {
  __typename: "ProductType";
  id: string;
  variantAttributes: (ProductVariantReorder_productVariantReorder_product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
  taxType: ProductVariantReorder_productVariantReorder_product_productType_taxType | null;
}

export interface ProductVariantReorder_productVariantReorder_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductVariantReorder_productVariantReorder_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantReorder_productVariantReorder_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ProductVariantReorder_productVariantReorder_product_channelListings_pricing_priceRange_start_net;
}

export interface ProductVariantReorder_productVariantReorder_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantReorder_productVariantReorder_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ProductVariantReorder_productVariantReorder_product_channelListings_pricing_priceRange_stop_net;
}

export interface ProductVariantReorder_productVariantReorder_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ProductVariantReorder_productVariantReorder_product_channelListings_pricing_priceRange_start | null;
  stop: ProductVariantReorder_productVariantReorder_product_channelListings_pricing_priceRange_stop | null;
}

export interface ProductVariantReorder_productVariantReorder_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ProductVariantReorder_productVariantReorder_product_channelListings_pricing_priceRange | null;
}

export interface ProductVariantReorder_productVariantReorder_product_channelListings {
  __typename: "ProductChannelListing";
  channel: ProductVariantReorder_productVariantReorder_product_channelListings_channel;
  pricing: ProductVariantReorder_productVariantReorder_product_channelListings_pricing | null;
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
}

export interface ProductVariantReorder_productVariantReorder_product_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductVariantReorder_productVariantReorder_product_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductVariantReorder_productVariantReorder_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface ProductVariantReorder_productVariantReorder_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface ProductVariantReorder_productVariantReorder_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface ProductVariantReorder_productVariantReorder_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductVariantReorder_productVariantReorder_product_variants_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductVariantReorder_productVariantReorder_product_variants_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductVariantReorder_productVariantReorder_product_variants_stocks_warehouse;
}

export interface ProductVariantReorder_productVariantReorder_product_variants_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductVariantReorder_productVariantReorder_product_variants_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantReorder_productVariantReorder_product_variants_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantReorder_productVariantReorder_product_variants_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: ProductVariantReorder_productVariantReorder_product_variants_channelListings_channel;
  price: ProductVariantReorder_productVariantReorder_product_variants_channelListings_price | null;
  costPrice: ProductVariantReorder_productVariantReorder_product_variants_channelListings_costPrice | null;
}

export interface ProductVariantReorder_productVariantReorder_product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  margin: number | null;
  stocks: (ProductVariantReorder_productVariantReorder_product_variants_stocks | null)[] | null;
  trackInventory: boolean;
  channelListings: ProductVariantReorder_productVariantReorder_product_variants_channelListings[] | null;
}

export interface ProductVariantReorder_productVariantReorder_product_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductVariantReorder_productVariantReorder_product_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductVariantReorder_productVariantReorder_product {
  __typename: "Product";
  id: string;
  attributes: ProductVariantReorder_productVariantReorder_product_attributes[];
  productType: ProductVariantReorder_productVariantReorder_product_productType;
  channelListings: ProductVariantReorder_productVariantReorder_product_channelListings[] | null;
  metadata: (ProductVariantReorder_productVariantReorder_product_metadata | null)[];
  privateMetadata: (ProductVariantReorder_productVariantReorder_product_privateMetadata | null)[];
  name: string;
  slug: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  rating: number | null;
  defaultVariant: ProductVariantReorder_productVariantReorder_product_defaultVariant | null;
  category: ProductVariantReorder_productVariantReorder_product_category | null;
  collections: (ProductVariantReorder_productVariantReorder_product_collections | null)[] | null;
  chargeTaxes: boolean;
  images: (ProductVariantReorder_productVariantReorder_product_images | null)[] | null;
  isAvailable: boolean | null;
  variants: (ProductVariantReorder_productVariantReorder_product_variants | null)[] | null;
  weight: ProductVariantReorder_productVariantReorder_product_weight | null;
  taxType: ProductVariantReorder_productVariantReorder_product_taxType | null;
}

export interface ProductVariantReorder_productVariantReorder {
  __typename: "ProductVariantReorder";
  errors: ProductVariantReorder_productVariantReorder_errors[];
  product: ProductVariantReorder_productVariantReorder_product | null;
}

export interface ProductVariantReorder {
  productVariantReorder: ProductVariantReorder_productVariantReorder | null;
}

export interface ProductVariantReorderVariables {
  move: ReorderInput;
  productId: string;
}
