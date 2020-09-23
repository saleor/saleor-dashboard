/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: BulkProductErrorFragment
// ====================================================

export interface BulkProductErrorFragment {
  __typename: "BulkProductError";
  field: string | null;
  code: ProductErrorCode;
  index: number | null;
  channels: string[] | null;
}
