/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SaleChannelListingInput, DiscountErrorCode, SaleType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SaleChannelListingUpdate
// ====================================================

export interface SaleChannelListingUpdate_saleChannelListingUpdate_errors {
  __typename: "DiscountError";
  code: DiscountErrorCode;
  field: string | null;
  channels: string[] | null;
}

export interface SaleChannelListingUpdate_saleChannelListingUpdate_sale_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SaleChannelListingUpdate_saleChannelListingUpdate_sale_channelListings {
  __typename: "SaleChannelListing";
  id: string;
  channel: SaleChannelListingUpdate_saleChannelListingUpdate_sale_channelListings_channel;
  discountValue: number;
  currency: string;
}

export interface SaleChannelListingUpdate_saleChannelListingUpdate_sale {
  __typename: "Sale";
  id: string;
  name: string;
  type: SaleType;
  startDate: any;
  endDate: any | null;
  channelListings: SaleChannelListingUpdate_saleChannelListingUpdate_sale_channelListings[] | null;
}

export interface SaleChannelListingUpdate_saleChannelListingUpdate {
  __typename: "SaleChannelListingUpdate";
  errors: SaleChannelListingUpdate_saleChannelListingUpdate_errors[];
  sale: SaleChannelListingUpdate_saleChannelListingUpdate_sale | null;
}

export interface SaleChannelListingUpdate {
  saleChannelListingUpdate: SaleChannelListingUpdate_saleChannelListingUpdate | null;
}

export interface SaleChannelListingUpdateVariables {
  id: string;
  input: SaleChannelListingInput;
}
