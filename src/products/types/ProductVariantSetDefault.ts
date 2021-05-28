/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductVariantSetDefault
// ====================================================

export interface ProductVariantSetDefault_productVariantSetDefault_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_defaultVariant {
  __typename: "ProductVariant";
  id: string;
  name: string;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
}

export interface ProductVariantSetDefault_productVariantSetDefault_product {
  __typename: "Product";
  id: string;
  defaultVariant: ProductVariantSetDefault_productVariantSetDefault_product_defaultVariant | null;
  variants: (ProductVariantSetDefault_productVariantSetDefault_product_variants | null)[] | null;
}

export interface ProductVariantSetDefault_productVariantSetDefault {
  __typename: "ProductVariantSetDefault";
  errors: ProductVariantSetDefault_productVariantSetDefault_errors[];
  product: ProductVariantSetDefault_productVariantSetDefault_product | null;
}

export interface ProductVariantSetDefault {
  productVariantSetDefault: ProductVariantSetDefault_productVariantSetDefault | null;
}

export interface ProductVariantSetDefaultVariables {
  productId: string;
  variantId: string;
}
