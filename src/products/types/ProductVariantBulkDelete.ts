/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductVariantBulkDelete
// ====================================================

export interface ProductVariantBulkDelete_productVariantBulkDelete_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductVariantBulkDelete_productVariantBulkDelete {
  __typename: "ProductVariantBulkDelete";
  errors: ProductVariantBulkDelete_productVariantBulkDelete_errors[];
}

export interface ProductVariantBulkDelete {
  productVariantBulkDelete: ProductVariantBulkDelete_productVariantBulkDelete | null;
}

export interface ProductVariantBulkDeleteVariables {
  ids: string[];
}
