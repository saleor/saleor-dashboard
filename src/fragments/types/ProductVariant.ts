/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ProductVariant
// ====================================================

export interface ProductVariant_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductVariant_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductVariant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductVariant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (ProductVariant_attributes_attribute_values | null)[] | null;
}

export interface ProductVariant_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductVariant_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductVariant_attributes_attribute;
  values: (ProductVariant_attributes_values | null)[];
}

export interface ProductVariant_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariant_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface ProductVariant_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariant_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface ProductVariant_product_productType {
  __typename: "ProductType";
  id: string;
}

export interface ProductVariant_product_variants_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface ProductVariant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  images: (ProductVariant_product_variants_images | null)[] | null;
}

export interface ProductVariant_product {
  __typename: "Product";
  id: string;
  images: (ProductVariant_product_images | null)[] | null;
  name: string;
  thumbnail: ProductVariant_product_thumbnail | null;
  productType: ProductVariant_product_productType;
  variants: (ProductVariant_product_variants | null)[] | null;
}

export interface ProductVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductVariant_stocks_warehouse;
}

export interface ProductVariant_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductVariant {
  __typename: "ProductVariant";
  id: string;
  metadata: (ProductVariant_metadata | null)[];
  privateMetadata: (ProductVariant_privateMetadata | null)[];
  attributes: ProductVariant_attributes[];
  costPrice: ProductVariant_costPrice | null;
  images: (ProductVariant_images | null)[] | null;
  name: string;
  price: ProductVariant_price | null;
  product: ProductVariant_product;
  sku: string;
  stocks: (ProductVariant_stocks | null)[] | null;
  trackInventory: boolean;
  weight: ProductVariant_weight | null;
}
