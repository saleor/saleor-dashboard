/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { VoucherInput, DiscountErrorCode, DiscountValueTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VoucherCreate
// ====================================================

export interface VoucherCreate_voucherCreate_errors {
  __typename: "DiscountError";
  code: DiscountErrorCode;
  field: string | null;
}

export interface VoucherCreate_voucherCreate_voucher_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface VoucherCreate_voucherCreate_voucher_minSpent {
  __typename: "Money";
  currency: string;
  amount: number;
}

export interface VoucherCreate_voucherCreate_voucher_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
}

export interface VoucherCreate_voucherCreate_voucher_channelListing_minSpent {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VoucherCreate_voucherCreate_voucher_channelListing {
  __typename: "VoucherChannelListing";
  id: string;
  channel: VoucherCreate_voucherCreate_voucher_channelListing_channel;
  discountValue: number;
  currency: string;
  minSpent: VoucherCreate_voucherCreate_voucher_channelListing_minSpent | null;
}

export interface VoucherCreate_voucherCreate_voucher {
  __typename: "Voucher";
  id: string;
  code: string;
  startDate: any;
  endDate: any | null;
  usageLimit: number | null;
  discountValueType: DiscountValueTypeEnum;
  discountValue: number | null;
  countries: (VoucherCreate_voucherCreate_voucher_countries | null)[] | null;
  minSpent: VoucherCreate_voucherCreate_voucher_minSpent | null;
  minCheckoutItemsQuantity: number | null;
  channelListing: VoucherCreate_voucherCreate_voucher_channelListing[] | null;
}

export interface VoucherCreate_voucherCreate {
  __typename: "VoucherCreate";
  errors: VoucherCreate_voucherCreate_errors[];
  voucher: VoucherCreate_voucherCreate_voucher | null;
}

export interface VoucherCreate {
  voucherCreate: VoucherCreate_voucherCreate | null;
}

export interface VoucherCreateVariables {
  input: VoucherInput;
}
