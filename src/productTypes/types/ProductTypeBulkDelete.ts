/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductTypeBulkDelete
// ====================================================

export interface ProductTypeBulkDelete_productTypeBulkDelete_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductTypeBulkDelete_productTypeBulkDelete {
  __typename: "ProductTypeBulkDelete";
  errors: ProductTypeBulkDelete_productTypeBulkDelete_errors[];
}

export interface ProductTypeBulkDelete {
  productTypeBulkDelete: ProductTypeBulkDelete_productTypeBulkDelete | null;
}

export interface ProductTypeBulkDeleteVariables {
  ids: (string | null)[];
}
