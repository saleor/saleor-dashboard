/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ProductTypeBulkUpdateErrorFragment
// ====================================================

export interface ProductTypeBulkUpdateErrorFragment {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
  message: string | null;
}
