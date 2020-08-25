/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeValueInput, ProductVariantInput, SeoInput, StockInput, ProductErrorCode, AttributeInputTypeEnum, WeightUnitsEnum, StockErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SimpleProductUpdate
// ====================================================

export interface SimpleProductUpdate_productUpdate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface SimpleProductUpdate_productUpdate_product_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
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

export interface SimpleProductUpdate_productUpdate_product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SimpleProductUpdate_productUpdate_product_attributes {
  __typename: "SelectedAttribute";
  attribute: SimpleProductUpdate_productUpdate_product_attributes_attribute;
  values: (SimpleProductUpdate_productUpdate_product_attributes_values | null)[];
}

export interface SimpleProductUpdate_productUpdate_product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SimpleProductUpdate_productUpdate_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  values: (SimpleProductUpdate_productUpdate_product_productType_variantAttributes_values | null)[] | null;
}

export interface SimpleProductUpdate_productUpdate_product_productType {
  __typename: "ProductType";
  id: string;
  variantAttributes: (SimpleProductUpdate_productUpdate_product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
}

export interface SimpleProductUpdate_productUpdate_product_pricing_priceRangeUndiscounted_start_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productUpdate_product_pricing_priceRangeUndiscounted_start {
  __typename: "TaxedMoney";
  gross: SimpleProductUpdate_productUpdate_product_pricing_priceRangeUndiscounted_start_gross;
}

export interface SimpleProductUpdate_productUpdate_product_pricing_priceRangeUndiscounted_stop_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productUpdate_product_pricing_priceRangeUndiscounted_stop {
  __typename: "TaxedMoney";
  gross: SimpleProductUpdate_productUpdate_product_pricing_priceRangeUndiscounted_stop_gross;
}

export interface SimpleProductUpdate_productUpdate_product_pricing_priceRangeUndiscounted {
  __typename: "TaxedMoneyRange";
  start: SimpleProductUpdate_productUpdate_product_pricing_priceRangeUndiscounted_start | null;
  stop: SimpleProductUpdate_productUpdate_product_pricing_priceRangeUndiscounted_stop | null;
}

export interface SimpleProductUpdate_productUpdate_product_pricing {
  __typename: "ProductPricingInfo";
  priceRangeUndiscounted: SimpleProductUpdate_productUpdate_product_pricing_priceRangeUndiscounted | null;
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

export interface SimpleProductUpdate_productUpdate_product_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface SimpleProductUpdate_productUpdate_product_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productUpdate_product_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productUpdate_product_purchaseCost {
  __typename: "MoneyRange";
  start: SimpleProductUpdate_productUpdate_product_purchaseCost_start | null;
  stop: SimpleProductUpdate_productUpdate_product_purchaseCost_stop | null;
}

export interface SimpleProductUpdate_productUpdate_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface SimpleProductUpdate_productUpdate_product_variants_price {
  __typename: "Money";
  amount: number;
  currency: string;
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

export interface SimpleProductUpdate_productUpdate_product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  price: SimpleProductUpdate_productUpdate_product_variants_price | null;
  margin: number | null;
  stocks: (SimpleProductUpdate_productUpdate_product_variants_stocks | null)[] | null;
  trackInventory: boolean;
}

export interface SimpleProductUpdate_productUpdate_product_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface SimpleProductUpdate_productUpdate_product {
  __typename: "Product";
  id: string;
  attributes: SimpleProductUpdate_productUpdate_product_attributes[];
  productType: SimpleProductUpdate_productUpdate_product_productType;
  pricing: SimpleProductUpdate_productUpdate_product_pricing | null;
  metadata: (SimpleProductUpdate_productUpdate_product_metadata | null)[];
  privateMetadata: (SimpleProductUpdate_productUpdate_product_privateMetadata | null)[];
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: SimpleProductUpdate_productUpdate_product_category | null;
  collections: (SimpleProductUpdate_productUpdate_product_collections | null)[] | null;
  margin: SimpleProductUpdate_productUpdate_product_margin | null;
  purchaseCost: SimpleProductUpdate_productUpdate_product_purchaseCost | null;
  isAvailable: boolean | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  images: (SimpleProductUpdate_productUpdate_product_images | null)[] | null;
  variants: (SimpleProductUpdate_productUpdate_product_variants | null)[] | null;
  weight: SimpleProductUpdate_productUpdate_product_weight | null;
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

export interface SimpleProductUpdate_productVariantUpdate_productVariant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (SimpleProductUpdate_productVariantUpdate_productVariant_attributes_attribute_values | null)[] | null;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_attributes {
  __typename: "SelectedAttribute";
  attribute: SimpleProductUpdate_productVariantUpdate_productVariant_attributes_attribute;
  values: (SimpleProductUpdate_productVariantUpdate_productVariant_attributes_values | null)[];
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface SimpleProductUpdate_productVariantUpdate_productVariant_price {
  __typename: "Money";
  amount: number;
  currency: string;
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
  images: (SimpleProductUpdate_productVariantUpdate_productVariant_product_images | null)[] | null;
  name: string;
  thumbnail: SimpleProductUpdate_productVariantUpdate_productVariant_product_thumbnail | null;
  variants: (SimpleProductUpdate_productVariantUpdate_productVariant_product_variants | null)[] | null;
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
  attributes: SimpleProductUpdate_productVariantUpdate_productVariant_attributes[];
  costPrice: SimpleProductUpdate_productVariantUpdate_productVariant_costPrice | null;
  images: (SimpleProductUpdate_productVariantUpdate_productVariant_images | null)[] | null;
  name: string;
  price: SimpleProductUpdate_productVariantUpdate_productVariant_price | null;
  product: SimpleProductUpdate_productVariantUpdate_productVariant_product;
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

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (SimpleProductUpdate_productVariantStocksCreate_productVariant_attributes_attribute_values | null)[] | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_attributes {
  __typename: "SelectedAttribute";
  attribute: SimpleProductUpdate_productVariantStocksCreate_productVariant_attributes_attribute;
  values: (SimpleProductUpdate_productVariantStocksCreate_productVariant_attributes_values | null)[];
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface SimpleProductUpdate_productVariantStocksCreate_productVariant_price {
  __typename: "Money";
  amount: number;
  currency: string;
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
  images: (SimpleProductUpdate_productVariantStocksCreate_productVariant_product_images | null)[] | null;
  name: string;
  thumbnail: SimpleProductUpdate_productVariantStocksCreate_productVariant_product_thumbnail | null;
  variants: (SimpleProductUpdate_productVariantStocksCreate_productVariant_product_variants | null)[] | null;
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
  attributes: SimpleProductUpdate_productVariantStocksCreate_productVariant_attributes[];
  costPrice: SimpleProductUpdate_productVariantStocksCreate_productVariant_costPrice | null;
  images: (SimpleProductUpdate_productVariantStocksCreate_productVariant_images | null)[] | null;
  name: string;
  price: SimpleProductUpdate_productVariantStocksCreate_productVariant_price | null;
  product: SimpleProductUpdate_productVariantStocksCreate_productVariant_product;
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

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (SimpleProductUpdate_productVariantStocksDelete_productVariant_attributes_attribute_values | null)[] | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_attributes {
  __typename: "SelectedAttribute";
  attribute: SimpleProductUpdate_productVariantStocksDelete_productVariant_attributes_attribute;
  values: (SimpleProductUpdate_productVariantStocksDelete_productVariant_attributes_values | null)[];
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface SimpleProductUpdate_productVariantStocksDelete_productVariant_price {
  __typename: "Money";
  amount: number;
  currency: string;
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
  images: (SimpleProductUpdate_productVariantStocksDelete_productVariant_product_images | null)[] | null;
  name: string;
  thumbnail: SimpleProductUpdate_productVariantStocksDelete_productVariant_product_thumbnail | null;
  variants: (SimpleProductUpdate_productVariantStocksDelete_productVariant_product_variants | null)[] | null;
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
  attributes: SimpleProductUpdate_productVariantStocksDelete_productVariant_attributes[];
  costPrice: SimpleProductUpdate_productVariantStocksDelete_productVariant_costPrice | null;
  images: (SimpleProductUpdate_productVariantStocksDelete_productVariant_images | null)[] | null;
  name: string;
  price: SimpleProductUpdate_productVariantStocksDelete_productVariant_price | null;
  product: SimpleProductUpdate_productVariantStocksDelete_productVariant_product;
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

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (SimpleProductUpdate_productVariantStocksUpdate_productVariant_attributes_attribute_values | null)[] | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_attributes {
  __typename: "SelectedAttribute";
  attribute: SimpleProductUpdate_productVariantStocksUpdate_productVariant_attributes_attribute;
  values: (SimpleProductUpdate_productVariantStocksUpdate_productVariant_attributes_values | null)[];
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface SimpleProductUpdate_productVariantStocksUpdate_productVariant_price {
  __typename: "Money";
  amount: number;
  currency: string;
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
  images: (SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_images | null)[] | null;
  name: string;
  thumbnail: SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_thumbnail | null;
  variants: (SimpleProductUpdate_productVariantStocksUpdate_productVariant_product_variants | null)[] | null;
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
  attributes: SimpleProductUpdate_productVariantStocksUpdate_productVariant_attributes[];
  costPrice: SimpleProductUpdate_productVariantStocksUpdate_productVariant_costPrice | null;
  images: (SimpleProductUpdate_productVariantStocksUpdate_productVariant_images | null)[] | null;
  name: string;
  price: SimpleProductUpdate_productVariantStocksUpdate_productVariant_price | null;
  product: SimpleProductUpdate_productVariantStocksUpdate_productVariant_product;
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
  attributes?: (AttributeValueInput | null)[] | null;
  publicationDate?: any | null;
  category?: string | null;
  chargeTaxes: boolean;
  collections?: (string | null)[] | null;
  descriptionJson?: any | null;
  isPublished: boolean;
  name?: string | null;
  basePrice?: any | null;
  productVariantId: string;
  productVariantInput: ProductVariantInput;
  seo?: SeoInput | null;
  addStocks: StockInput[];
  deleteStocks: string[];
  updateStocks: StockInput[];
  weight?: any | null;
}
