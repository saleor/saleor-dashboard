/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "@saleor/graphql";

// ====================================================
// GraphQL fragment: BulkProductErrorFragment
// ====================================================

export interface BulkProductErrorFragment {
  __typename: "BulkProductError";
  field: string | null;
  code: ProductErrorCode;
  index: number | null;
  channels: string[] | null;
  message: string | null;
}
