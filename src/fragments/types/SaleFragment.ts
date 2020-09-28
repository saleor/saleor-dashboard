/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SaleType } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: SaleFragment
// ====================================================

export interface SaleFragment_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
}

export interface SaleFragment_channelListing {
  __typename: "SaleChannelListing";
  id: string;
  channel: SaleFragment_channelListing_channel;
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
  channelListing: SaleFragment_channelListing[] | null;
}
