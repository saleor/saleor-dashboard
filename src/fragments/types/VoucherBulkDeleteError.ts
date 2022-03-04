/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DiscountErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: VoucherBulkDeleteError
// ====================================================

export interface VoucherBulkDeleteError {
  __typename: "DiscountError";
  code: DiscountErrorCode;
  field: string | null;
  message: string | null;
}
