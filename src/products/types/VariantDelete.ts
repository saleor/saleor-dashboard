/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VariantDelete
// ====================================================

export interface VariantDelete_productVariantDelete_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface VariantDelete_productVariantDelete_productVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface VariantDelete_productVariantDelete {
  __typename: "ProductVariantDelete";
  errors: VariantDelete_productVariantDelete_errors[];
  productVariant: VariantDelete_productVariantDelete_productVariant | null;
}

export interface VariantDelete {
  productVariantDelete: VariantDelete_productVariantDelete | null;
}

export interface VariantDeleteVariables {
  id: string;
}
