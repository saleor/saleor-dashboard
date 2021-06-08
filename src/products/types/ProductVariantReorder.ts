/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReorderInput, ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductVariantReorder
// ====================================================

export interface ProductVariantReorder_productVariantReorder_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductVariantReorder_productVariantReorder_product_variants {
  __typename: "ProductVariant";
  id: string;
}

export interface ProductVariantReorder_productVariantReorder_product {
  __typename: "Product";
  id: string;
  variants: (ProductVariantReorder_productVariantReorder_product_variants | null)[] | null;
}

export interface ProductVariantReorder_productVariantReorder {
  __typename: "ProductVariantReorder";
  errors: ProductVariantReorder_productVariantReorder_errors[];
  product: ProductVariantReorder_productVariantReorder_product | null;
}

export interface ProductVariantReorder {
  productVariantReorder: ProductVariantReorder_productVariantReorder | null;
}

export interface ProductVariantReorderVariables {
  move: ReorderInput;
  productId: string;
}
