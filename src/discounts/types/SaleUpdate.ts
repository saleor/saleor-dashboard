/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SaleInput, DiscountErrorCode, SaleType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SaleUpdate
// ====================================================

export interface SaleUpdate_saleUpdate_errors {
  __typename: "DiscountError";
  code: DiscountErrorCode;
  field: string | null;
  channels: string[] | null;
}

export interface SaleUpdate_saleUpdate_sale_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SaleUpdate_saleUpdate_sale_channelListings {
  __typename: "SaleChannelListing";
  id: string;
  channel: SaleUpdate_saleUpdate_sale_channelListings_channel;
  discountValue: number;
  currency: string;
}

export interface SaleUpdate_saleUpdate_sale {
  __typename: "Sale";
  id: string;
  name: string;
  type: SaleType;
  startDate: any;
  endDate: any | null;
  channelListings: SaleUpdate_saleUpdate_sale_channelListings[] | null;
}

export interface SaleUpdate_saleUpdate {
  __typename: "SaleUpdate";
  errors: SaleUpdate_saleUpdate_errors[];
  sale: SaleUpdate_saleUpdate_sale | null;
}

export interface SaleUpdate {
  saleUpdate: SaleUpdate_saleUpdate | null;
}

export interface SaleUpdateVariables {
  input: SaleInput;
  id: string;
}
