/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductInput, ProductVariantInput, StockInput, ProductErrorCode, AttributeInputTypeEnum, WeightUnitsEnum, StockErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SimpleProductUpdate
// ====================================================

export interface SimpleProductUpdate_productUpdate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
  attributes: string[] | null;
}

export interface SimpleProductUpdate_productUpdate_product_attributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SimpleProductUpdate_productUpdate_product_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SimpleProductUpdate_productUpdate_product_attributes_attribute_values_file | null;
}

export interface SimpleProductUpdate_productUpdate_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (SimpleProductUpdate_productUpdate_product_attributes_attribute_values | null)[] | null;
}

export interface SimpleProductUpdate_productUpdate_product_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SimpleProductUpdate_productUpdate_product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SimpleProductUpdate_productUpdate_product_attributes_values_file | null;
}

export interface SimpleProductUpdate_productUpdate_product_attributes {
  __typename: "SelectedAttribute";
  attribute: SimpleProductUpdate_productUpdate_product_attributes_attribute;
  values: (SimpleProductUpdate_productUpdate_product_attributes_values | null)[];
}

export interface SimpleProductUpdate_productUpdate_product_productType_variantAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SimpleProductUpdate_productUpdate_product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SimpleProductUpdate_productUpdate_product_productType_variantAttributes_values_file | null;
}

export interface SimpleProductUpdate_productUpdate_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  values: (SimpleProductUpdate_productUpdate_product_productType_variantAttributes_values | null)[] | null;
}

export interface SimpleProductUpdate_productUpdate_product_productType_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface SimpleProductUpdate_productUpdate_product_productType {
  __typename: "ProductType";
  id: string;
  variantAttributes: (SimpleProductUpdate_productUpdate_product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
  taxType: SimpleProductUpdate_productUpdate_product_productType_taxType | null;
}

export interface SimpleProductUpdate_productUpdate_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SimpleProductUpdate_productUpdate_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productUpdate_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: SimpleProductUpdate_productUpdate_product_channelListings_pricing_priceRange_start_net;
}

export interface SimpleProductUpdate_productUpdate_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productUpdate_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: SimpleProductUpdate_productUpdate_product_channelListings_pricing_priceRange_stop_net;
}

export interface SimpleProductUpdate_productUpdate_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: SimpleProductUpdate_productUpdate_product_channelListings_pricing_priceRange_start | null;
  stop: SimpleProductUpdate_productUpdate_product_channelListings_pricing_priceRange_stop | null;
}

export interface SimpleProductUpdate_productUpdate_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: SimpleProductUpdate_productUpdate_product_channelListings_pricing_priceRange | null;
}

export interface SimpleProductUpdate_productUpdate_product_channelListings {
  __typename: "ProductChannelListing";
  channel: SimpleProductUpdate_productUpdate_product_channelListings_channel;
  pricing: SimpleProductUpdate_productUpdate_product_channelListings_pricing | null;
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
}

export interface SimpleProductUpdate_productUpdate_product_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface SimpleProductUpdate_productUpdate_product_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface SimpleProductUpdate_productUpdate_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface SimpleProductUpdate_productUpdate_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface SimpleProductUpdate_productUpdate_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface SimpleProductUpdate_productUpdate_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface SimpleProductUpdate_productUpdate_product_variants_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface SimpleProductUpdate_productUpdate_product_variants_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: SimpleProductUpdate_productUpdate_product_variants_stocks_warehouse;
}

export interface SimpleProductUpdate_productUpdate_product_variants_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SimpleProductUpdate_productUpdate_product_variants_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productUpdate_product_variants_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productUpdate_product_variants_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: SimpleProductUpdate_productUpdate_product_variants_channelListings_channel;
  price: SimpleProductUpdate_productUpdate_product_variants_channelListings_price | null;
  costPrice: SimpleProductUpdate_productUpdate_product_variants_channelListings_costPrice | null;
}

export interface SimpleProductUpdate_productUpdate_product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  margin: number | null;
  stocks: (SimpleProductUpdate_productUpdate_product_variants_stocks | null)[] | null;
  trackInventory: boolean;
  channelListings: SimpleProductUpdate_productUpdate_product_variants_channelListings[] | null;
}

export interface SimpleProductUpdate_productUpdate_product_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface SimpleProductUpdate_productUpdate_product_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface SimpleProductUpdate_productUpdate_product {
  __typename: "Product";
  id: string;
  attributes: SimpleProductUpdate_productUpdate_product_attributes[];
  productType: SimpleProductUpdate_productUpdate_product_productType;
  channelListings: SimpleProductUpdate_productUpdate_product_channelListings[] | null;
  metadata: (SimpleProductUpdate_productUpdate_product_metadata | null)[];
  privateMetadata: (SimpleProductUpdate_productUpdate_product_privateMetadata | null)[];
  name: string;
  slug: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  rating: number | null;
  defaultVariant: SimpleProductUpdate_productUpdate_product_defaultVariant | null;
  category: SimpleProductUpdate_productUpdate_product_category | null;
  collections: (SimpleProductUpdate_productUpdate_product_collections | null)[] | null;
  chargeTaxes: boolean;
  images: (SimpleProductUpdate_productUpdate_product_images | null)[] | null;
  isAvailable: boolean | null;
  variants: (SimpleProductUpdate_productUpdate_product_variants | null)[] | null;
  weight: SimpleProductUpdate_productUpdate_product_weight | null;
  taxType: SimpleProductUpdate_productUpdate_product_taxType | null;
}

export interface SimpleProductUpdate_productUpdate {
  __typename: "ProductUpdate";
  errors: SimpleProductUpdate_productUpdate_errors[];
  product: SimpleProductUpdate_productUpdate_product | null;
}

export interface SimpleProductUpdate_productVariantUpdate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
  attributes: string[] | null;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_selectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_selectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SimpleProductUpdate_productVariantUpdate_productVariant_selectionAttributes_attribute_values_file | null;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_selectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (SimpleProductUpdate_productVariantUpdate_productVariant_selectionAttributes_attribute_values | null)[] | null;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_selectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_selectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SimpleProductUpdate_productVariantUpdate_productVariant_selectionAttributes_values_file | null;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_selectionAttributes {
  __typename: "SelectedAttribute";
  attribute: SimpleProductUpdate_productVariantUpdate_productVariant_selectionAttributes_attribute;
  values: (SimpleProductUpdate_productVariantUpdate_productVariant_selectionAttributes_values | null)[];
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_nonSelectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_nonSelectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SimpleProductUpdate_productVariantUpdate_productVariant_nonSelectionAttributes_attribute_values_file | null;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_nonSelectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (SimpleProductUpdate_productVariantUpdate_productVariant_nonSelectionAttributes_attribute_values | null)[] | null;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_nonSelectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_nonSelectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SimpleProductUpdate_productVariantUpdate_productVariant_nonSelectionAttributes_values_file | null;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_nonSelectionAttributes {
  __typename: "SelectedAttribute";
  attribute: SimpleProductUpdate_productVariantUpdate_productVariant_nonSelectionAttributes_attribute;
  values: (SimpleProductUpdate_productVariantUpdate_productVariant_nonSelectionAttributes_values | null)[];
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: SimpleProductUpdate_productVariantUpdate_productVariant_product_channelListings_pricing_priceRange_start_net;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: SimpleProductUpdate_productVariantUpdate_productVariant_product_channelListings_pricing_priceRange_stop_net;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: SimpleProductUpdate_productVariantUpdate_productVariant_product_channelListings_pricing_priceRange_start | null;
  stop: SimpleProductUpdate_productVariantUpdate_productVariant_product_channelListings_pricing_priceRange_stop | null;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: SimpleProductUpdate_productVariantUpdate_productVariant_product_channelListings_pricing_priceRange | null;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_product_channelListings {
  __typename: "ProductChannelListing";
  channel: SimpleProductUpdate_productVariantUpdate_productVariant_product_channelListings_channel;
  pricing: SimpleProductUpdate_productVariantUpdate_productVariant_product_channelListings_pricing | null;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_product_variants_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  images: (SimpleProductUpdate_productVariantUpdate_productVariant_product_variants_images | null)[] | null;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_product {
  __typename: "Product";
  id: string;
  defaultVariant: SimpleProductUpdate_productVariantUpdate_productVariant_product_defaultVariant | null;
  images: (SimpleProductUpdate_productVariantUpdate_productVariant_product_images | null)[] | null;
  name: string;
  thumbnail: SimpleProductUpdate_productVariantUpdate_productVariant_product_thumbnail | null;
  channelListings: SimpleProductUpdate_productVariantUpdate_productVariant_product_channelListings[] | null;
  variants: (SimpleProductUpdate_productVariantUpdate_productVariant_product_variants | null)[] | null;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: SimpleProductUpdate_productVariantUpdate_productVariant_channelListings_channel;
  price: SimpleProductUpdate_productVariantUpdate_productVariant_channelListings_price | null;
  costPrice: SimpleProductUpdate_productVariantUpdate_productVariant_channelListings_costPrice | null;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: SimpleProductUpdate_productVariantUpdate_productVariant_stocks_warehouse;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant {
  __typename: "ProductVariant";
  id: string;
  metadata: (SimpleProductUpdate_productVariantUpdate_productVariant_metadata | null)[];
  privateMetadata: (SimpleProductUpdate_productVariantUpdate_productVariant_privateMetadata | null)[];
  selectionAttributes: SimpleProductUpdate_productVariantUpdate_productVariant_selectionAttributes[];
  nonSelectionAttributes: SimpleProductUpdate_productVariantUpdate_productVariant_nonSelectionAttributes[];
  images: (SimpleProductUpdate_productVariantUpdate_productVariant_images | null)[] | null;
  name: string;
  product: SimpleProductUpdate_productVariantUpdate_productVariant_product;
  channelListings: SimpleProductUpdate_productVariantUpdate_productVariant_channelListings[] | null;
  sku: string;
  stocks: (SimpleProductUpdate_productVariantUpdate_productVariant_stocks | null)[] | null;
  trackInventory: boolean;
  weight: SimpleProductUpdate_productVariantUpdate_productVariant_weight | null;
}

export interface SimpleProductUpdate_productVariantUpdate {
  __typename: "ProductVariantUpdate";
  errors: SimpleProductUpdate_productVariantUpdate_errors[];
  productVariant: SimpleProductUpdate_productVariantUpdate_productVariant | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_errors {
  __typename: "BulkStockError";
  code: ProductErrorCode;
  field: string | null;
  index: number | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_selectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_selectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SimpleProductUpdate_productVariantStocksCreate_productVariant_selectionAttributes_attribute_values_file | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_selectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (SimpleProductUpdate_productVariantStocksCreate_productVariant_selectionAttributes_attribute_values | null)[] | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_selectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_selectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SimpleProductUpdate_productVariantStocksCreate_productVariant_selectionAttributes_values_file | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_selectionAttributes {
  __typename: "SelectedAttribute";
  attribute: SimpleProductUpdate_productVariantStocksCreate_productVariant_selectionAttributes_attribute;
  values: (SimpleProductUpdate_productVariantStocksCreate_productVariant_selectionAttributes_values | null)[];
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_nonSelectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_nonSelectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SimpleProductUpdate_productVariantStocksCreate_productVariant_nonSelectionAttributes_attribute_values_file | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_nonSelectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (SimpleProductUpdate_productVariantStocksCreate_productVariant_nonSelectionAttributes_attribute_values | null)[] | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_nonSelectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_nonSelectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SimpleProductUpdate_productVariantStocksCreate_productVariant_nonSelectionAttributes_values_file | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_nonSelectionAttributes {
  __typename: "SelectedAttribute";
  attribute: SimpleProductUpdate_productVariantStocksCreate_productVariant_nonSelectionAttributes_attribute;
  values: (SimpleProductUpdate_productVariantStocksCreate_productVariant_nonSelectionAttributes_values | null)[];
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: SimpleProductUpdate_productVariantStocksCreate_productVariant_product_channelListings_pricing_priceRange_start_net;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: SimpleProductUpdate_productVariantStocksCreate_productVariant_product_channelListings_pricing_priceRange_stop_net;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: SimpleProductUpdate_productVariantStocksCreate_productVariant_product_channelListings_pricing_priceRange_start | null;
  stop: SimpleProductUpdate_productVariantStocksCreate_productVariant_product_channelListings_pricing_priceRange_stop | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: SimpleProductUpdate_productVariantStocksCreate_productVariant_product_channelListings_pricing_priceRange | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_product_channelListings {
  __typename: "ProductChannelListing";
  channel: SimpleProductUpdate_productVariantStocksCreate_productVariant_product_channelListings_channel;
  pricing: SimpleProductUpdate_productVariantStocksCreate_productVariant_product_channelListings_pricing | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_product_variants_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  images: (SimpleProductUpdate_productVariantStocksCreate_productVariant_product_variants_images | null)[] | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_product {
  __typename: "Product";
  id: string;
  defaultVariant: SimpleProductUpdate_productVariantStocksCreate_productVariant_product_defaultVariant | null;
  images: (SimpleProductUpdate_productVariantStocksCreate_productVariant_product_images | null)[] | null;
  name: string;
  thumbnail: SimpleProductUpdate_productVariantStocksCreate_productVariant_product_thumbnail | null;
  channelListings: SimpleProductUpdate_productVariantStocksCreate_productVariant_product_channelListings[] | null;
  variants: (SimpleProductUpdate_productVariantStocksCreate_productVariant_product_variants | null)[] | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: SimpleProductUpdate_productVariantStocksCreate_productVariant_channelListings_channel;
  price: SimpleProductUpdate_productVariantStocksCreate_productVariant_channelListings_price | null;
  costPrice: SimpleProductUpdate_productVariantStocksCreate_productVariant_channelListings_costPrice | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: SimpleProductUpdate_productVariantStocksCreate_productVariant_stocks_warehouse;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant {
  __typename: "ProductVariant";
  id: string;
  metadata: (SimpleProductUpdate_productVariantStocksCreate_productVariant_metadata | null)[];
  privateMetadata: (SimpleProductUpdate_productVariantStocksCreate_productVariant_privateMetadata | null)[];
  selectionAttributes: SimpleProductUpdate_productVariantStocksCreate_productVariant_selectionAttributes[];
  nonSelectionAttributes: SimpleProductUpdate_productVariantStocksCreate_productVariant_nonSelectionAttributes[];
  images: (SimpleProductUpdate_productVariantStocksCreate_productVariant_images | null)[] | null;
  name: string;
  product: SimpleProductUpdate_productVariantStocksCreate_productVariant_product;
  channelListings: SimpleProductUpdate_productVariantStocksCreate_productVariant_channelListings[] | null;
  sku: string;
  stocks: (SimpleProductUpdate_productVariantStocksCreate_productVariant_stocks | null)[] | null;
  trackInventory: boolean;
  weight: SimpleProductUpdate_productVariantStocksCreate_productVariant_weight | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate {
  __typename: "ProductVariantStocksCreate";
  errors: SimpleProductUpdate_productVariantStocksCreate_errors[];
  productVariant: SimpleProductUpdate_productVariantStocksCreate_productVariant | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_errors {
  __typename: "StockError";
  code: StockErrorCode;
  field: string | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_selectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_selectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SimpleProductUpdate_productVariantStocksDelete_productVariant_selectionAttributes_attribute_values_file | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_selectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (SimpleProductUpdate_productVariantStocksDelete_productVariant_selectionAttributes_attribute_values | null)[] | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_selectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_selectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SimpleProductUpdate_productVariantStocksDelete_productVariant_selectionAttributes_values_file | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_selectionAttributes {
  __typename: "SelectedAttribute";
  attribute: SimpleProductUpdate_productVariantStocksDelete_productVariant_selectionAttributes_attribute;
  values: (SimpleProductUpdate_productVariantStocksDelete_productVariant_selectionAttributes_values | null)[];
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_nonSelectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_nonSelectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SimpleProductUpdate_productVariantStocksDelete_productVariant_nonSelectionAttributes_attribute_values_file | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_nonSelectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (SimpleProductUpdate_productVariantStocksDelete_productVariant_nonSelectionAttributes_attribute_values | null)[] | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_nonSelectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_nonSelectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SimpleProductUpdate_productVariantStocksDelete_productVariant_nonSelectionAttributes_values_file | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_nonSelectionAttributes {
  __typename: "SelectedAttribute";
  attribute: SimpleProductUpdate_productVariantStocksDelete_productVariant_nonSelectionAttributes_attribute;
  values: (SimpleProductUpdate_productVariantStocksDelete_productVariant_nonSelectionAttributes_values | null)[];
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: SimpleProductUpdate_productVariantStocksDelete_productVariant_product_channelListings_pricing_priceRange_start_net;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: SimpleProductUpdate_productVariantStocksDelete_productVariant_product_channelListings_pricing_priceRange_stop_net;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: SimpleProductUpdate_productVariantStocksDelete_productVariant_product_channelListings_pricing_priceRange_start | null;
  stop: SimpleProductUpdate_productVariantStocksDelete_productVariant_product_channelListings_pricing_priceRange_stop | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: SimpleProductUpdate_productVariantStocksDelete_productVariant_product_channelListings_pricing_priceRange | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_product_channelListings {
  __typename: "ProductChannelListing";
  channel: SimpleProductUpdate_productVariantStocksDelete_productVariant_product_channelListings_channel;
  pricing: SimpleProductUpdate_productVariantStocksDelete_productVariant_product_channelListings_pricing | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_product_variants_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  images: (SimpleProductUpdate_productVariantStocksDelete_productVariant_product_variants_images | null)[] | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_product {
  __typename: "Product";
  id: string;
  defaultVariant: SimpleProductUpdate_productVariantStocksDelete_productVariant_product_defaultVariant | null;
  images: (SimpleProductUpdate_productVariantStocksDelete_productVariant_product_images | null)[] | null;
  name: string;
  thumbnail: SimpleProductUpdate_productVariantStocksDelete_productVariant_product_thumbnail | null;
  channelListings: SimpleProductUpdate_productVariantStocksDelete_productVariant_product_channelListings[] | null;
  variants: (SimpleProductUpdate_productVariantStocksDelete_productVariant_product_variants | null)[] | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: SimpleProductUpdate_productVariantStocksDelete_productVariant_channelListings_channel;
  price: SimpleProductUpdate_productVariantStocksDelete_productVariant_channelListings_price | null;
  costPrice: SimpleProductUpdate_productVariantStocksDelete_productVariant_channelListings_costPrice | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: SimpleProductUpdate_productVariantStocksDelete_productVariant_stocks_warehouse;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant {
  __typename: "ProductVariant";
  id: string;
  metadata: (SimpleProductUpdate_productVariantStocksDelete_productVariant_metadata | null)[];
  privateMetadata: (SimpleProductUpdate_productVariantStocksDelete_productVariant_privateMetadata | null)[];
  selectionAttributes: SimpleProductUpdate_productVariantStocksDelete_productVariant_selectionAttributes[];
  nonSelectionAttributes: SimpleProductUpdate_productVariantStocksDelete_productVariant_nonSelectionAttributes[];
  images: (SimpleProductUpdate_productVariantStocksDelete_productVariant_images | null)[] | null;
  name: string;
  product: SimpleProductUpdate_productVariantStocksDelete_productVariant_product;
  channelListings: SimpleProductUpdate_productVariantStocksDelete_productVariant_channelListings[] | null;
  sku: string;
  stocks: (SimpleProductUpdate_productVariantStocksDelete_productVariant_stocks | null)[] | null;
  trackInventory: boolean;
  weight: SimpleProductUpdate_productVariantStocksDelete_productVariant_weight | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete {
  __typename: "ProductVariantStocksDelete";
  errors: SimpleProductUpdate_productVariantStocksDelete_errors[];
  productVariant: SimpleProductUpdate_productVariantStocksDelete_productVariant | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_errors {
  __typename: "BulkStockError";
  code: ProductErrorCode;
  field: string | null;
  index: number | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_selectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_selectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SimpleProductUpdate_productVariantStocksUpdate_productVariant_selectionAttributes_attribute_values_file | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_selectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (SimpleProductUpdate_productVariantStocksUpdate_productVariant_selectionAttributes_attribute_values | null)[] | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_selectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_selectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SimpleProductUpdate_productVariantStocksUpdate_productVariant_selectionAttributes_values_file | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_selectionAttributes {
  __typename: "SelectedAttribute";
  attribute: SimpleProductUpdate_productVariantStocksUpdate_productVariant_selectionAttributes_attribute;
  values: (SimpleProductUpdate_productVariantStocksUpdate_productVariant_selectionAttributes_values | null)[];
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_nonSelectionAttributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_nonSelectionAttributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SimpleProductUpdate_productVariantStocksUpdate_productVariant_nonSelectionAttributes_attribute_values_file | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_nonSelectionAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (SimpleProductUpdate_productVariantStocksUpdate_productVariant_nonSelectionAttributes_attribute_values | null)[] | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_nonSelectionAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_nonSelectionAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SimpleProductUpdate_productVariantStocksUpdate_productVariant_nonSelectionAttributes_values_file | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_nonSelectionAttributes {
  __typename: "SelectedAttribute";
  attribute: SimpleProductUpdate_productVariantStocksUpdate_productVariant_nonSelectionAttributes_attribute;
  values: (SimpleProductUpdate_productVariantStocksUpdate_productVariant_nonSelectionAttributes_values | null)[];
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_channelListings_pricing_priceRange_start_net;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_channelListings_pricing_priceRange_stop_net;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_channelListings_pricing_priceRange_start | null;
  stop: SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_channelListings_pricing_priceRange_stop | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_channelListings_pricing_priceRange | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_channelListings {
  __typename: "ProductChannelListing";
  channel: SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_channelListings_channel;
  pricing: SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_channelListings_pricing | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_variants_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  images: (SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_variants_images | null)[] | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_product {
  __typename: "Product";
  id: string;
  defaultVariant: SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_defaultVariant | null;
  images: (SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_images | null)[] | null;
  name: string;
  thumbnail: SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_thumbnail | null;
  channelListings: SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_channelListings[] | null;
  variants: (SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_variants | null)[] | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: SimpleProductUpdate_productVariantStocksUpdate_productVariant_channelListings_channel;
  price: SimpleProductUpdate_productVariantStocksUpdate_productVariant_channelListings_price | null;
  costPrice: SimpleProductUpdate_productVariantStocksUpdate_productVariant_channelListings_costPrice | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: SimpleProductUpdate_productVariantStocksUpdate_productVariant_stocks_warehouse;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant {
  __typename: "ProductVariant";
  id: string;
  metadata: (SimpleProductUpdate_productVariantStocksUpdate_productVariant_metadata | null)[];
  privateMetadata: (SimpleProductUpdate_productVariantStocksUpdate_productVariant_privateMetadata | null)[];
  selectionAttributes: SimpleProductUpdate_productVariantStocksUpdate_productVariant_selectionAttributes[];
  nonSelectionAttributes: SimpleProductUpdate_productVariantStocksUpdate_productVariant_nonSelectionAttributes[];
  images: (SimpleProductUpdate_productVariantStocksUpdate_productVariant_images | null)[] | null;
  name: string;
  product: SimpleProductUpdate_productVariantStocksUpdate_productVariant_product;
  channelListings: SimpleProductUpdate_productVariantStocksUpdate_productVariant_channelListings[] | null;
  sku: string;
  stocks: (SimpleProductUpdate_productVariantStocksUpdate_productVariant_stocks | null)[] | null;
  trackInventory: boolean;
  weight: SimpleProductUpdate_productVariantStocksUpdate_productVariant_weight | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate {
  __typename: "ProductVariantStocksUpdate";
  errors: SimpleProductUpdate_productVariantStocksUpdate_errors[];
  productVariant: SimpleProductUpdate_productVariantStocksUpdate_productVariant | null;
}

export interface SimpleProductUpdate {
  productUpdate: SimpleProductUpdate_productUpdate | null;
  productVariantUpdate: SimpleProductUpdate_productVariantUpdate | null;
  productVariantStocksCreate: SimpleProductUpdate_productVariantStocksCreate | null;
  productVariantStocksDelete: SimpleProductUpdate_productVariantStocksDelete | null;
  productVariantStocksUpdate: SimpleProductUpdate_productVariantStocksUpdate | null;
}

export interface SimpleProductUpdateVariables {
  id: string;
  input: ProductInput;
  productVariantId: string;
  productVariantInput: ProductVariantInput;
  addStocks: StockInput[];
  deleteStocks: string[];
  updateStocks: StockInput[];
}
