/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductErrorCode, ProductMediaType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VariantMediaUnassign
// ====================================================

export interface VariantMediaUnassign_variantMediaUnassign_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_media {
  __typename: "ProductMedia";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_product_media {
  __typename: "ProductMedia";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_product_variants_media {
  __typename: "ProductMedia";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  media: VariantMediaUnassign_variantMediaUnassign_productVariant_product_variants_media[] | null;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant_product {
  __typename: "Product";
  id: string;
  media: VariantMediaUnassign_variantMediaUnassign_productVariant_product_media[] | null;
  variants: (VariantMediaUnassign_variantMediaUnassign_productVariant_product_variants | null)[] | null;
}

export interface VariantMediaUnassign_variantMediaUnassign_productVariant {
  __typename: "ProductVariant";
  id: string;
  media: VariantMediaUnassign_variantMediaUnassign_productVariant_media[] | null;
  product: VariantMediaUnassign_variantMediaUnassign_productVariant_product;
}

export interface VariantMediaUnassign_variantMediaUnassign {
  __typename: "VariantMediaUnassign";
  errors: VariantMediaUnassign_variantMediaUnassign_errors[];
  productVariant: VariantMediaUnassign_variantMediaUnassign_productVariant | null;
}

export interface VariantMediaUnassign {
  variantMediaUnassign: VariantMediaUnassign_variantMediaUnassign | null;
}

export interface VariantMediaUnassignVariables {
  variantId: string;
  mediaId: string;
}
