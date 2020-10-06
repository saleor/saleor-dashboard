/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DiscountErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SaleDelete
// ====================================================

export interface SaleDelete_saleDelete_errors {
  __typename: "DiscountError";
  code: DiscountErrorCode;
  field: string | null;
  channels: string[] | null;
}

export interface SaleDelete_saleDelete {
  __typename: "SaleDelete";
  errors: SaleDelete_saleDelete_errors[];
}

export interface SaleDelete {
  saleDelete: SaleDelete_saleDelete | null;
}

export interface SaleDeleteVariables {
  id: string;
}
