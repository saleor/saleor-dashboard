/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SaleType } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: SaleFragment
// ====================================================

export interface SaleFragment_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface SaleFragment_channelListings {
  __typename: "SaleChannelListing";
  id: string;
  channel: SaleFragment_channelListings_channel;
  discountValue: number;
  currency: string;
}

export interface SaleFragment {
  __typename: "Sale";
  id: string;
  name: string;
  type: SaleType;
  startDate: any;
  endDate: any | null;
  channelListings: SaleFragment_channelListings[] | null;
}
