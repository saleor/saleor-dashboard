/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductVariantCreateInput, ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VariantCreate
// ====================================================

export interface VariantCreate_productVariantCreate_productErrors {
  __typename: "ProductError";
  code: ProductErrorCode | null;
  field: string | null;
  message: string | null;
}

export interface VariantCreate_productVariantCreate_productVariant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface VariantCreate_productVariantCreate_productVariant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  values: (VariantCreate_productVariantCreate_productVariant_attributes_attribute_values | null)[] | null;
}

export interface VariantCreate_productVariantCreate_productVariant_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface VariantCreate_productVariantCreate_productVariant_attributes {
  __typename: "SelectedAttribute";
  attribute: VariantCreate_productVariantCreate_productVariant_attributes_attribute;
  values: (VariantCreate_productVariantCreate_productVariant_attributes_values | null)[];
}

export interface VariantCreate_productVariantCreate_productVariant_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantCreate_productVariantCreate_productVariant_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface VariantCreate_productVariantCreate_productVariant_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantCreate_productVariantCreate_productVariant_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface VariantCreate_productVariantCreate_productVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface VariantCreate_productVariantCreate_productVariant_product_variants_images {
  __typename: "ProductImage";
  id: string;
  url: string;
}

export interface VariantCreate_productVariantCreate_productVariant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  images: (VariantCreate_productVariantCreate_productVariant_product_variants_images | null)[] | null;
}

export interface VariantCreate_productVariantCreate_productVariant_product {
  __typename: "Product";
  id: string;
  images: (VariantCreate_productVariantCreate_productVariant_product_images | null)[] | null;
  name: string;
  thumbnail: VariantCreate_productVariantCreate_productVariant_product_thumbnail | null;
  variants: (VariantCreate_productVariantCreate_productVariant_product_variants | null)[] | null;
}

export interface VariantCreate_productVariantCreate_productVariant {
  __typename: "ProductVariant";
  id: string;
  attributes: VariantCreate_productVariantCreate_productVariant_attributes[];
  costPrice: VariantCreate_productVariantCreate_productVariant_costPrice | null;
  images: (VariantCreate_productVariantCreate_productVariant_images | null)[] | null;
  name: string;
  priceOverride: VariantCreate_productVariantCreate_productVariant_priceOverride | null;
  product: VariantCreate_productVariantCreate_productVariant_product;
  sku: string;
  quantity: number;
  quantityAllocated: number | null;
}

export interface VariantCreate_productVariantCreate {
  __typename: "ProductVariantCreate";
  productErrors: VariantCreate_productVariantCreate_productErrors[] | null;
  productVariant: VariantCreate_productVariantCreate_productVariant | null;
}

export interface VariantCreate {
  productVariantCreate: VariantCreate_productVariantCreate | null;
}

export interface VariantCreateVariables {
  input: ProductVariantCreateInput;
}
