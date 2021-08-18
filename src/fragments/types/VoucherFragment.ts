/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { VoucherTypeEnum, DiscountValueTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: VoucherFragment
// ====================================================

export interface VoucherFragment_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VoucherFragment_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface VoucherFragment_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface VoucherFragment_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface VoucherFragment_channelListings_minSpent {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VoucherFragment_channelListings {
  __typename: "VoucherChannelListing";
  id: string;
  channel: VoucherFragment_channelListings_channel;
  discountValue: number;
  currency: string;
  minSpent: VoucherFragment_channelListings_minSpent | null;
}

export interface VoucherFragment {
  __typename: "Voucher";
  metadata: (VoucherFragment_metadata | null)[];
  privateMetadata: (VoucherFragment_privateMetadata | null)[];
  id: string;
  code: string;
  startDate: any;
  endDate: any | null;
  usageLimit: number | null;
  type: VoucherTypeEnum;
  discountValueType: DiscountValueTypeEnum;
  countries: (VoucherFragment_countries | null)[] | null;
  minCheckoutItemsQuantity: number | null;
  channelListings: VoucherFragment_channelListings[] | null;
}
