/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "@saleor/graphql";

// ====================================================
// GraphQL fragment: BulkStockErrorFragment
// ====================================================

export interface BulkStockErrorFragment {
  __typename: "BulkStockError";
  code: ProductErrorCode;
  field: string | null;
  index: number | null;
  message: string | null;
}
