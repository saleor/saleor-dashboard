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
  channels: string[] | null;
}

export interface VoucherCreate_voucherCreate_voucher_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface VoucherCreate_voucherCreate_voucher_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VoucherCreate_voucherCreate_voucher_channelListings_minSpent {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VoucherCreate_voucherCreate_voucher_channelListings {
  __typename: "VoucherChannelListing";
  id: string;
  channel: VoucherCreate_voucherCreate_voucher_channelListings_channel;
  discountValue: number;
  currency: string;
  minSpent: VoucherCreate_voucherCreate_voucher_channelListings_minSpent | null;
}

export interface VoucherCreate_voucherCreate_voucher {
  __typename: "Voucher";
  id: string;
  code: string;
  startDate: any;
  endDate: any | null;
  usageLimit: number | null;
  discountValueType: DiscountValueTypeEnum;
  countries: (VoucherCreate_voucherCreate_voucher_countries | null)[] | null;
  minCheckoutItemsQuantity: number | null;
  channelListings: VoucherCreate_voucherCreate_voucher_channelListings[] | null;
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
