/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { VoucherChannelListingInput, DiscountErrorCode, VoucherTypeEnum, DiscountValueTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VoucherChannelListingUpdate
// ====================================================

export interface VoucherChannelListingUpdate_voucherChannelListingUpdate_errors {
  __typename: "DiscountError";
  code: DiscountErrorCode;
  field: string | null;
  channels: string[] | null;
}

export interface VoucherChannelListingUpdate_voucherChannelListingUpdate_voucher_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VoucherChannelListingUpdate_voucherChannelListingUpdate_voucher_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VoucherChannelListingUpdate_voucherChannelListingUpdate_voucher_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface VoucherChannelListingUpdate_voucherChannelListingUpdate_voucher_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VoucherChannelListingUpdate_voucherChannelListingUpdate_voucher_channelListings_minSpent {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VoucherChannelListingUpdate_voucherChannelListingUpdate_voucher_channelListings {
  __typename: "VoucherChannelListing";
  id: string;
  channel: VoucherChannelListingUpdate_voucherChannelListingUpdate_voucher_channelListings_channel;
  discountValue: number;
  currency: string;
  minSpent: VoucherChannelListingUpdate_voucherChannelListingUpdate_voucher_channelListings_minSpent | null;
}

export interface VoucherChannelListingUpdate_voucherChannelListingUpdate_voucher {
  __typename: "Voucher";
  metadata: (VoucherChannelListingUpdate_voucherChannelListingUpdate_voucher_metadata | null)[];
  privateMetadata: (VoucherChannelListingUpdate_voucherChannelListingUpdate_voucher_privateMetadata | null)[];
  id: string;
  code: string;
  startDate: any;
  endDate: any | null;
  usageLimit: number | null;
  type: VoucherTypeEnum;
  discountValueType: DiscountValueTypeEnum;
  countries: (VoucherChannelListingUpdate_voucherChannelListingUpdate_voucher_countries | null)[] | null;
  minCheckoutItemsQuantity: number | null;
  channelListings: VoucherChannelListingUpdate_voucherChannelListingUpdate_voucher_channelListings[] | null;
}

export interface VoucherChannelListingUpdate_voucherChannelListingUpdate {
  __typename: "VoucherChannelListingUpdate";
  errors: VoucherChannelListingUpdate_voucherChannelListingUpdate_errors[];
  voucher: VoucherChannelListingUpdate_voucherChannelListingUpdate_voucher | null;
}

export interface VoucherChannelListingUpdate {
  voucherChannelListingUpdate: VoucherChannelListingUpdate_voucherChannelListingUpdate | null;
}

export interface VoucherChannelListingUpdateVariables {
  id: string;
  input: VoucherChannelListingInput;
}
