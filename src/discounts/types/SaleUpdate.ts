/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SaleInput, SaleChannelListingInput, DiscountErrorCode, SaleType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SaleUpdate
// ====================================================

export interface SaleUpdate_saleUpdate_errors {
  __typename: "DiscountError";
  code: DiscountErrorCode;
  field: string | null;
  channels: string[] | null;
}

export interface SaleUpdate_saleUpdate {
  __typename: "SaleUpdate";
  errors: SaleUpdate_saleUpdate_errors[];
}

export interface SaleUpdate_saleChannelListingUpdate_errors {
  __typename: "DiscountError";
  code: DiscountErrorCode;
  field: string | null;
  channels: string[] | null;
}

export interface SaleUpdate_saleChannelListingUpdate_sale_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface SaleUpdate_saleChannelListingUpdate_sale_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface SaleUpdate_saleChannelListingUpdate_sale_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SaleUpdate_saleChannelListingUpdate_sale_channelListings {
  __typename: "SaleChannelListing";
  id: string;
  channel: SaleUpdate_saleChannelListingUpdate_sale_channelListings_channel;
  discountValue: number;
  currency: string;
}

export interface SaleUpdate_saleChannelListingUpdate_sale {
  __typename: "Sale";
  metadata: (SaleUpdate_saleChannelListingUpdate_sale_metadata | null)[];
  privateMetadata: (SaleUpdate_saleChannelListingUpdate_sale_privateMetadata | null)[];
  id: string;
  name: string;
  type: SaleType;
  startDate: any;
  endDate: any | null;
  channelListings: SaleUpdate_saleChannelListingUpdate_sale_channelListings[] | null;
}

export interface SaleUpdate_saleChannelListingUpdate {
  __typename: "SaleChannelListingUpdate";
  errors: SaleUpdate_saleChannelListingUpdate_errors[];
  sale: SaleUpdate_saleChannelListingUpdate_sale | null;
}

export interface SaleUpdate {
  saleUpdate: SaleUpdate_saleUpdate | null;
  saleChannelListingUpdate: SaleUpdate_saleChannelListingUpdate | null;
}

export interface SaleUpdateVariables {
  input: SaleInput;
  id: string;
  channelInput: SaleChannelListingInput;
}
