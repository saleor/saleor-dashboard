/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductVariantBulkCreateInput, ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductVariantBulkCreate
// ====================================================

export interface ProductVariantBulkCreate_productVariantBulkCreate_bulkProductErrors {
  __typename: "BulkProductError";
  field: string | null;
  message: string | null;
  code: ProductErrorCode;
  index: number | null;
}

export interface ProductVariantBulkCreate_productVariantBulkCreate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface ProductVariantBulkCreate_productVariantBulkCreate {
  __typename: "ProductVariantBulkCreate";
  bulkProductErrors: ProductVariantBulkCreate_productVariantBulkCreate_bulkProductErrors[];
  errors: ProductVariantBulkCreate_productVariantBulkCreate_errors[];
}

export interface ProductVariantBulkCreate {
  productVariantBulkCreate: ProductVariantBulkCreate_productVariantBulkCreate | null;
}

export interface ProductVariantBulkCreateVariables {
  id: string;
  inputs: (ProductVariantBulkCreateInput | null)[];
}
