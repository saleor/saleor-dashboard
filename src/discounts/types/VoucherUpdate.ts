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
  channels: string[] | null;
}

export interface VoucherUpdate_voucherUpdate_voucher_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface VoucherUpdate_voucherUpdate_voucher_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VoucherUpdate_voucherUpdate_voucher_channelListing_minSpent {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VoucherUpdate_voucherUpdate_voucher_channelListing {
  __typename: "VoucherChannelListing";
  id: string;
  channel: VoucherUpdate_voucherUpdate_voucher_channelListing_channel;
  discountValue: number;
  currency: string;
  minSpent: VoucherUpdate_voucherUpdate_voucher_channelListing_minSpent | null;
}

export interface VoucherUpdate_voucherUpdate_voucher {
  __typename: "Voucher";
  id: string;
  code: string;
  startDate: any;
  endDate: any | null;
  usageLimit: number | null;
  discountValueType: DiscountValueTypeEnum;
  countries: (VoucherUpdate_voucherUpdate_voucher_countries | null)[] | null;
  minCheckoutItemsQuantity: number | null;
  channelListing: VoucherUpdate_voucherUpdate_voucher_channelListing[] | null;
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
