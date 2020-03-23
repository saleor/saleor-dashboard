/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SaleInput, DiscountErrorCode, SaleType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SaleCreate
// ====================================================

export interface SaleCreate_saleCreate_errors {
  __typename: "DiscountError";
  code: DiscountErrorCode;
  field: string | null;
}

export interface SaleCreate_saleCreate_sale {
  __typename: "Sale";
  id: string;
  name: string;
  type: SaleType;
  startDate: any;
  endDate: any | null;
  value: number;
}

export interface SaleCreate_saleCreate {
  __typename: "SaleCreate";
  errors: SaleCreate_saleCreate_errors[];
  sale: SaleCreate_saleCreate_sale | null;
}

export interface SaleCreate {
  saleCreate: SaleCreate_saleCreate | null;
}

export interface SaleCreateVariables {
  input: SaleInput;
}
