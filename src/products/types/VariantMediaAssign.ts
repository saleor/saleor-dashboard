/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductErrorCode, ProductMediaType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VariantMediaAssign
// ====================================================

export interface VariantMediaAssign_variantMediaAssign_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_media {
  __typename: "ProductMedia";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_product_media {
  __typename: "ProductMedia";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_product_variants_media {
  __typename: "ProductMedia";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  media: VariantMediaAssign_variantMediaAssign_productVariant_product_variants_media[] | null;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant_product {
  __typename: "Product";
  id: string;
  media: VariantMediaAssign_variantMediaAssign_productVariant_product_media[] | null;
  variants: (VariantMediaAssign_variantMediaAssign_productVariant_product_variants | null)[] | null;
}

export interface VariantMediaAssign_variantMediaAssign_productVariant {
  __typename: "ProductVariant";
  id: string;
  media: VariantMediaAssign_variantMediaAssign_productVariant_media[] | null;
  product: VariantMediaAssign_variantMediaAssign_productVariant_product;
}

export interface VariantMediaAssign_variantMediaAssign {
  __typename: "VariantMediaAssign";
  errors: VariantMediaAssign_variantMediaAssign_errors[];
  productVariant: VariantMediaAssign_variantMediaAssign_productVariant | null;
}

export interface VariantMediaAssign {
  variantMediaAssign: VariantMediaAssign_variantMediaAssign | null;
}

export interface VariantMediaAssignVariables {
  variantId: string;
  mediaId: string;
}
