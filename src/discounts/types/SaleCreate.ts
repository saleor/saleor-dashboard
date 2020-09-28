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
}

export interface SaleCreate_saleCreate_sale_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
}

export interface SaleCreate_saleCreate_sale_channelListing {
  __typename: "SaleChannelListing";
  id: string;
  channel: SaleCreate_saleCreate_sale_channelListing_channel;
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
  channelListing: SaleCreate_saleCreate_sale_channelListing[] | null;
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
