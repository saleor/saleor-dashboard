/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { VoucherInput, DiscountErrorCode, DiscountValueTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VoucherUpdate
// ====================================================

export interface VoucherUpdate_voucherUpdate_errors {
  __typename: "DiscountError";
  code: DiscountErrorCode;
  field: string | null;
}

export interface VoucherUpdate_voucherUpdate_voucher_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface VoucherUpdate_voucherUpdate_voucher_minSpent {
  __typename: "Money";
  currency: string;
  amount: number;
}

export interface VoucherUpdate_voucherUpdate_voucher {
  __typename: "Voucher";
  id: string;
  code: string;
  startDate: any;
  endDate: any | null;
  usageLimit: number | null;
  discountValueType: DiscountValueTypeEnum;
  discountValue: number;
  countries: (VoucherUpdate_voucherUpdate_voucher_countries | null)[] | null;
  minSpent: VoucherUpdate_voucherUpdate_voucher_minSpent | null;
  minCheckoutItemsQuantity: number | null;
}

export interface VoucherUpdate_voucherUpdate {
  __typename: "VoucherUpdate";
  errors: VoucherUpdate_voucherUpdate_errors[];
  voucher: VoucherUpdate_voucherUpdate_voucher | null;
}

export interface VoucherUpdate {
  voucherUpdate: VoucherUpdate_voucherUpdate | null;
}

export interface VoucherUpdateVariables {
  input: VoucherInput;
  id: string;
}
