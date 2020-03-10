/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: productBulkDelete
// ====================================================

export interface productBulkDelete_productBulkDelete_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface productBulkDelete_productBulkDelete {
  __typename: "ProductBulkDelete";
  errors: productBulkDelete_productBulkDelete_errors[];
}

export interface productBulkDelete {
  productBulkDelete: productBulkDelete_productBulkDelete | null;
}

export interface productBulkDeleteVariables {
  ids: string[];
}
