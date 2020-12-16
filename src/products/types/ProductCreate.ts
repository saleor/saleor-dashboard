/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductCreateInput, ProductErrorCode, AttributeInputTypeEnum, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductCreate
// ====================================================

export interface ProductCreate_productCreate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
  attributes: string[] | null;
}

export interface ProductCreate_productCreate_product_attributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductCreate_productCreate_product_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductCreate_productCreate_product_attributes_attribute_values_file | null;
}

export interface ProductCreate_productCreate_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (ProductCreate_productCreate_product_attributes_attribute_values | null)[] | null;
}

export interface ProductCreate_productCreate_product_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductCreate_productCreate_product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductCreate_productCreate_product_attributes_values_file | null;
}

export interface ProductCreate_productCreate_product_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductCreate_productCreate_product_attributes_attribute;
  values: (ProductCreate_productCreate_product_attributes_values | null)[];
}

export interface ProductCreate_productCreate_product_productType_variantAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductCreate_productCreate_product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductCreate_productCreate_product_productType_variantAttributes_values_file | null;
}

export interface ProductCreate_productCreate_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  values: (ProductCreate_productCreate_product_productType_variantAttributes_values | null)[] | null;
}

export interface ProductCreate_productCreate_product_productType_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductCreate_productCreate_product_productType {
  __typename: "ProductType";
  id: string;
  variantAttributes: (ProductCreate_productCreate_product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
  taxType: ProductCreate_productCreate_product_productType_taxType | null;
}

export interface ProductCreate_productCreate_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductCreate_productCreate_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductCreate_productCreate_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ProductCreate_productCreate_product_channelListings_pricing_priceRange_start_net;
}

export interface ProductCreate_productCreate_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductCreate_productCreate_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ProductCreate_productCreate_product_channelListings_pricing_priceRange_stop_net;
}

export interface ProductCreate_productCreate_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ProductCreate_productCreate_product_channelListings_pricing_priceRange_start | null;
  stop: ProductCreate_productCreate_product_channelListings_pricing_priceRange_stop | null;
}

export interface ProductCreate_productCreate_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ProductCreate_productCreate_product_channelListings_pricing_priceRange | null;
}

export interface ProductCreate_productCreate_product_channelListings {
  __typename: "ProductChannelListing";
  channel: ProductCreate_productCreate_product_channelListings_channel;
  pricing: ProductCreate_productCreate_product_channelListings_pricing | null;
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
}

export interface ProductCreate_productCreate_product_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductCreate_productCreate_product_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductCreate_productCreate_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface ProductCreate_productCreate_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface ProductCreate_productCreate_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface ProductCreate_productCreate_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductCreate_productCreate_product_variants_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductCreate_productCreate_product_variants_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductCreate_productCreate_product_variants_stocks_warehouse;
}

export interface ProductCreate_productCreate_product_variants_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductCreate_productCreate_product_variants_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductCreate_productCreate_product_variants_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductCreate_productCreate_product_variants_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: ProductCreate_productCreate_product_variants_channelListings_channel;
  price: ProductCreate_productCreate_product_variants_channelListings_price | null;
  costPrice: ProductCreate_productCreate_product_variants_channelListings_costPrice | null;
}

export interface ProductCreate_productCreate_product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  margin: number | null;
  stocks: (ProductCreate_productCreate_product_variants_stocks | null)[] | null;
  trackInventory: boolean;
  channelListings: ProductCreate_productCreate_product_variants_channelListings[] | null;
}

export interface ProductCreate_productCreate_product_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductCreate_productCreate_product_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductCreate_productCreate_product {
  __typename: "Product";
  id: string;
  attributes: ProductCreate_productCreate_product_attributes[];
  productType: ProductCreate_productCreate_product_productType;
  channelListings: ProductCreate_productCreate_product_channelListings[] | null;
  metadata: (ProductCreate_productCreate_product_metadata | null)[];
  privateMetadata: (ProductCreate_productCreate_product_privateMetadata | null)[];
  name: string;
  slug: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  rating: number | null;
  defaultVariant: ProductCreate_productCreate_product_defaultVariant | null;
  category: ProductCreate_productCreate_product_category | null;
  collections: (ProductCreate_productCreate_product_collections | null)[] | null;
  chargeTaxes: boolean;
  images: (ProductCreate_productCreate_product_images | null)[] | null;
  isAvailable: boolean | null;
  variants: (ProductCreate_productCreate_product_variants | null)[] | null;
  weight: ProductCreate_productCreate_product_weight | null;
  taxType: ProductCreate_productCreate_product_taxType | null;
}

export interface ProductCreate_productCreate {
  __typename: "ProductCreate";
  errors: ProductCreate_productCreate_errors[];
  product: ProductCreate_productCreate_product | null;
}

export interface ProductCreate {
  productCreate: ProductCreate_productCreate | null;
}

export interface ProductCreateVariables {
  input: ProductCreateInput;
}
