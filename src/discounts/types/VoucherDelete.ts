/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DiscountErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VoucherDelete
// ====================================================

export interface VoucherDelete_voucherDelete_errors {
  __typename: "DiscountError";
  code: DiscountErrorCode;
  field: string | null;
  channels: string[] | null;
}

export interface VoucherDelete_voucherDelete {
  __typename: "VoucherDelete";
  errors: VoucherDelete_voucherDelete_errors[];
}

export interface VoucherDelete {
  voucherDelete: VoucherDelete_voucherDelete | null;
}

export interface VoucherDeleteVariables {
  id: string;
}
