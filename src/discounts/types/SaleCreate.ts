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
  channels: string[] | null;
}

export interface SaleCreate_saleCreate_sale_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SaleCreate_saleCreate_sale_channelListings {
  __typename: "SaleChannelListing";
  id: string;
  channel: SaleCreate_saleCreate_sale_channelListings_channel;
  discountValue: number;
  currency: string;
}

export interface SaleCreate_saleCreate_sale {
  __typename: "Sale";
  id: string;
  name: string;
  type: SaleType;
  startDate: any;
  endDate: any | null;
  channelListings: SaleCreate_saleCreate_sale_channelListings[] | null;
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
