/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { StockInput, AttributeValueInput, ProductErrorCode, WeightUnitsEnum, StockErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VariantUpdate
// ====================================================

export interface VariantUpdate_productVariantUpdate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface VariantUpdate_productVariantUpdate_productVariant_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VariantUpdate_productVariantUpdate_productVariant_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VariantUpdate_productVariantUpdate_productVariant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface VariantUpdate_productVariantUpdate_productVariant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (VariantUpdate_productVariantUpdate_productVariant_attributes_attribute_values | null)[] | null;
}

export interface VariantUpdate_productVariantUpdate_productVariant_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface VariantUpdate_productVariantUpdate_productVariant_attributes {
  __typename: "SelectedAttribute";
  attribute: VariantUpdate_productVariantUpdate_productVariant_attributes_attribute;
  values: (VariantUpdate_productVariantUpdate_productVariant_attributes_values | null)[];
}

export interface VariantUpdate_productVariantUpdate_productVariant_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantUpdate_productVariantUpdate_productVariant_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface VariantUpdate_productVariantUpdate_productVariant_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantUpdate_productVariantUpdate_productVariant_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface VariantUpdate_productVariantUpdate_productVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface VariantUpdate_productVariantUpdate_productVariant_product_productType {
  __typename: "ProductType";
  id: string;
}

export interface VariantUpdate_productVariantUpdate_productVariant_product_variants_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface VariantUpdate_productVariantUpdate_productVariant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  images: (VariantUpdate_productVariantUpdate_productVariant_product_variants_images | null)[] | null;
}

export interface VariantUpdate_productVariantUpdate_productVariant_product {
  __typename: "Product";
  id: string;
  images: (VariantUpdate_productVariantUpdate_productVariant_product_images | null)[] | null;
  name: string;
  thumbnail: VariantUpdate_productVariantUpdate_productVariant_product_thumbnail | null;
  productType: VariantUpdate_productVariantUpdate_productVariant_product_productType;
  variants: (VariantUpdate_productVariantUpdate_productVariant_product_variants | null)[] | null;
}

export interface VariantUpdate_productVariantUpdate_productVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface VariantUpdate_productVariantUpdate_productVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: VariantUpdate_productVariantUpdate_productVariant_stocks_warehouse;
}

export interface VariantUpdate_productVariantUpdate_productVariant_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface VariantUpdate_productVariantUpdate_productVariant {
  __typename: "ProductVariant";
  id: string;
  metadata: (VariantUpdate_productVariantUpdate_productVariant_metadata | null)[];
  privateMetadata: (VariantUpdate_productVariantUpdate_productVariant_privateMetadata | null)[];
  attributes: VariantUpdate_productVariantUpdate_productVariant_attributes[];
  costPrice: VariantUpdate_productVariantUpdate_productVariant_costPrice | null;
  images: (VariantUpdate_productVariantUpdate_productVariant_images | null)[] | null;
  name: string;
  price: VariantUpdate_productVariantUpdate_productVariant_price | null;
  product: VariantUpdate_productVariantUpdate_productVariant_product;
  sku: string;
  stocks: (VariantUpdate_productVariantUpdate_productVariant_stocks | null)[] | null;
  trackInventory: boolean;
  weight: VariantUpdate_productVariantUpdate_productVariant_weight | null;
}

export interface VariantUpdate_productVariantUpdate {
  __typename: "ProductVariantUpdate";
  errors: VariantUpdate_productVariantUpdate_errors[];
  productVariant: VariantUpdate_productVariantUpdate_productVariant | null;
}

export interface VariantUpdate_productVariantStocksUpdate_errors {
  __typename: "BulkStockError";
  code: ProductErrorCode;
  field: string | null;
  index: number | null;
}

export interface VariantUpdate_productVariantStocksUpdate_productVariant_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VariantUpdate_productVariantStocksUpdate_productVariant_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VariantUpdate_productVariantStocksUpdate_productVariant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface VariantUpdate_productVariantStocksUpdate_productVariant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (VariantUpdate_productVariantStocksUpdate_productVariant_attributes_attribute_values | null)[] | null;
}

export interface VariantUpdate_productVariantStocksUpdate_productVariant_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface VariantUpdate_productVariantStocksUpdate_productVariant_attributes {
  __typename: "SelectedAttribute";
  attribute: VariantUpdate_productVariantStocksUpdate_productVariant_attributes_attribute;
  values: (VariantUpdate_productVariantStocksUpdate_productVariant_attributes_values | null)[];
}

export interface VariantUpdate_productVariantStocksUpdate_productVariant_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantUpdate_productVariantStocksUpdate_productVariant_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface VariantUpdate_productVariantStocksUpdate_productVariant_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantUpdate_productVariantStocksUpdate_productVariant_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface VariantUpdate_productVariantStocksUpdate_productVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface VariantUpdate_productVariantStocksUpdate_productVariant_product_productType {
  __typename: "ProductType";
  id: string;
}

export interface VariantUpdate_productVariantStocksUpdate_productVariant_product_variants_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface VariantUpdate_productVariantStocksUpdate_productVariant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  images: (VariantUpdate_productVariantStocksUpdate_productVariant_product_variants_images | null)[] | null;
}

export interface VariantUpdate_productVariantStocksUpdate_productVariant_product {
  __typename: "Product";
  id: string;
  images: (VariantUpdate_productVariantStocksUpdate_productVariant_product_images | null)[] | null;
  name: string;
  thumbnail: VariantUpdate_productVariantStocksUpdate_productVariant_product_thumbnail | null;
  productType: VariantUpdate_productVariantStocksUpdate_productVariant_product_productType;
  variants: (VariantUpdate_productVariantStocksUpdate_productVariant_product_variants | null)[] | null;
}

export interface VariantUpdate_productVariantStocksUpdate_productVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface VariantUpdate_productVariantStocksUpdate_productVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: VariantUpdate_productVariantStocksUpdate_productVariant_stocks_warehouse;
}

export interface VariantUpdate_productVariantStocksUpdate_productVariant_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface VariantUpdate_productVariantStocksUpdate_productVariant {
  __typename: "ProductVariant";
  id: string;
  metadata: (VariantUpdate_productVariantStocksUpdate_productVariant_metadata | null)[];
  privateMetadata: (VariantUpdate_productVariantStocksUpdate_productVariant_privateMetadata | null)[];
  attributes: VariantUpdate_productVariantStocksUpdate_productVariant_attributes[];
  costPrice: VariantUpdate_productVariantStocksUpdate_productVariant_costPrice | null;
  images: (VariantUpdate_productVariantStocksUpdate_productVariant_images | null)[] | null;
  name: string;
  price: VariantUpdate_productVariantStocksUpdate_productVariant_price | null;
  product: VariantUpdate_productVariantStocksUpdate_productVariant_product;
  sku: string;
  stocks: (VariantUpdate_productVariantStocksUpdate_productVariant_stocks | null)[] | null;
  trackInventory: boolean;
  weight: VariantUpdate_productVariantStocksUpdate_productVariant_weight | null;
}

export interface VariantUpdate_productVariantStocksUpdate {
  __typename: "ProductVariantStocksUpdate";
  errors: VariantUpdate_productVariantStocksUpdate_errors[];
  productVariant: VariantUpdate_productVariantStocksUpdate_productVariant | null;
}

export interface VariantUpdate_productVariantStocksCreate_errors {
  __typename: "BulkStockError";
  code: ProductErrorCode;
  field: string | null;
  index: number | null;
}

export interface VariantUpdate_productVariantStocksCreate_productVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface VariantUpdate_productVariantStocksCreate_productVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: VariantUpdate_productVariantStocksCreate_productVariant_stocks_warehouse;
}

export interface VariantUpdate_productVariantStocksCreate_productVariant {
  __typename: "ProductVariant";
  id: string;
  stocks: (VariantUpdate_productVariantStocksCreate_productVariant_stocks | null)[] | null;
}

export interface VariantUpdate_productVariantStocksCreate {
  __typename: "ProductVariantStocksCreate";
  errors: VariantUpdate_productVariantStocksCreate_errors[];
  productVariant: VariantUpdate_productVariantStocksCreate_productVariant | null;
}

export interface VariantUpdate_productVariantStocksDelete_errors {
  __typename: "StockError";
  code: StockErrorCode;
  field: string | null;
}

export interface VariantUpdate_productVariantStocksDelete_productVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface VariantUpdate_productVariantStocksDelete_productVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: VariantUpdate_productVariantStocksDelete_productVariant_stocks_warehouse;
}

export interface VariantUpdate_productVariantStocksDelete_productVariant {
  __typename: "ProductVariant";
  id: string;
  stocks: (VariantUpdate_productVariantStocksDelete_productVariant_stocks | null)[] | null;
}

export interface VariantUpdate_productVariantStocksDelete {
  __typename: "ProductVariantStocksDelete";
  errors: VariantUpdate_productVariantStocksDelete_errors[];
  productVariant: VariantUpdate_productVariantStocksDelete_productVariant | null;
}

export interface VariantUpdate {
  productVariantUpdate: VariantUpdate_productVariantUpdate | null;
  productVariantStocksUpdate: VariantUpdate_productVariantStocksUpdate | null;
  productVariantStocksCreate: VariantUpdate_productVariantStocksCreate | null;
  productVariantStocksDelete: VariantUpdate_productVariantStocksDelete | null;
}

export interface VariantUpdateVariables {
  addStocks: StockInput[];
  removeStocks: string[];
  id: string;
  attributes?: (AttributeValueInput | null)[] | null;
  costPrice?: any | null;
  price?: any | null;
  sku?: string | null;
  trackInventory: boolean;
  stocks: StockInput[];
  weight?: any | null;
}
