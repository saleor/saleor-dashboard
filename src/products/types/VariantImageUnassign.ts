/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VariantImageUnassign
// ====================================================

export interface VariantImageUnassign_variantImageUnassign_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (VariantImageUnassign_variantImageUnassign_productVariant_attributes_attribute_values | null)[] | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_attributes {
  __typename: "SelectedAttribute";
  attribute: VariantImageUnassign_variantImageUnassign_productVariant_attributes_attribute;
  values: (VariantImageUnassign_variantImageUnassign_productVariant_attributes_values | null)[];
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_product_productType {
  __typename: "ProductType";
  id: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_product_variants_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  images: (VariantImageUnassign_variantImageUnassign_productVariant_product_variants_images | null)[] | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_product {
  __typename: "Product";
  id: string;
  images: (VariantImageUnassign_variantImageUnassign_productVariant_product_images | null)[] | null;
  name: string;
  thumbnail: VariantImageUnassign_variantImageUnassign_productVariant_product_thumbnail | null;
  productType: VariantImageUnassign_variantImageUnassign_productVariant_product_productType;
  variants: (VariantImageUnassign_variantImageUnassign_productVariant_product_variants | null)[] | null;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: VariantImageUnassign_variantImageUnassign_productVariant_stocks_warehouse;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface VariantImageUnassign_variantImageUnassign_productVariant {
  __typename: "ProductVariant";
  id: string;
  metadata: (VariantImageUnassign_variantImageUnassign_productVariant_metadata | null)[];
  privateMetadata: (VariantImageUnassign_variantImageUnassign_productVariant_privateMetadata | null)[];
  attributes: VariantImageUnassign_variantImageUnassign_productVariant_attributes[];
  costPrice: VariantImageUnassign_variantImageUnassign_productVariant_costPrice | null;
  images: (VariantImageUnassign_variantImageUnassign_productVariant_images | null)[] | null;
  name: string;
  price: VariantImageUnassign_variantImageUnassign_productVariant_price | null;
  product: VariantImageUnassign_variantImageUnassign_productVariant_product;
  sku: string;
  stocks: (VariantImageUnassign_variantImageUnassign_productVariant_stocks | null)[] | null;
  trackInventory: boolean;
  weight: VariantImageUnassign_variantImageUnassign_productVariant_weight | null;
}

export interface VariantImageUnassign_variantImageUnassign {
  __typename: "VariantImageUnassign";
  errors: VariantImageUnassign_variantImageUnassign_errors[];
  productVariant: VariantImageUnassign_variantImageUnassign_productVariant | null;
}

export interface VariantImageUnassign {
  variantImageUnassign: VariantImageUnassign_variantImageUnassign | null;
}

export interface VariantImageUnassignVariables {
  variantId: string;
  imageId: string;
}
