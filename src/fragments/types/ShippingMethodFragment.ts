/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WeightUnitsEnum, ShippingMethodTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ShippingMethodFragment
// ====================================================

export interface ShippingMethodFragment_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingMethodFragment_minimumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingMethodFragment_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingMethodFragment_maximumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingMethodFragment_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingMethodFragment_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ShippingMethodFragment_channelListing_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingMethodFragment_channelListing_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingMethodFragment_channelListing_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingMethodFragment_channelListing {
  __typename: "ShippingMethodChannelListing";
  id: string;
  channel: ShippingMethodFragment_channelListing_channel;
  price: ShippingMethodFragment_channelListing_price | null;
  minimumOrderPrice: ShippingMethodFragment_channelListing_minimumOrderPrice | null;
  maximumOrderPrice: ShippingMethodFragment_channelListing_maximumOrderPrice | null;
}

export interface ShippingMethodFragment {
  __typename: "ShippingMethod";
  id: string;
  minimumOrderPrice: ShippingMethodFragment_minimumOrderPrice | null;
  minimumOrderWeight: ShippingMethodFragment_minimumOrderWeight | null;
  maximumOrderPrice: ShippingMethodFragment_maximumOrderPrice | null;
  maximumOrderWeight: ShippingMethodFragment_maximumOrderWeight | null;
  name: string;
  price: ShippingMethodFragment_price | null;
  type: ShippingMethodTypeEnum | null;
  channelListing: ShippingMethodFragment_channelListing[] | null;
}
