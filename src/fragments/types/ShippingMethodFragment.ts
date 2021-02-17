/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PostalCodeRuleInclusionTypeEnum, WeightUnitsEnum, ShippingMethodTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ShippingMethodFragment
// ====================================================

export interface ShippingMethodFragment_postalCodeRules {
  __typename: "ShippingMethodPostalCodeRule";
  id: string;
  inclusionType: PostalCodeRuleInclusionTypeEnum | null;
  start: string | null;
  end: string | null;
}

export interface ShippingMethodFragment_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ShippingMethodFragment_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ShippingMethodFragment_minimumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingMethodFragment_maximumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingMethodFragment_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ShippingMethodFragment_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingMethodFragment_channelListings_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingMethodFragment_channelListings_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingMethodFragment_channelListings {
  __typename: "ShippingMethodChannelListing";
  id: string;
  channel: ShippingMethodFragment_channelListings_channel;
  price: ShippingMethodFragment_channelListings_price | null;
  minimumOrderPrice: ShippingMethodFragment_channelListings_minimumOrderPrice | null;
  maximumOrderPrice: ShippingMethodFragment_channelListings_maximumOrderPrice | null;
}

export interface ShippingMethodFragment {
  __typename: "ShippingMethod";
  id: string;
  postalCodeRules: (ShippingMethodFragment_postalCodeRules | null)[] | null;
  metadata: (ShippingMethodFragment_metadata | null)[];
  privateMetadata: (ShippingMethodFragment_privateMetadata | null)[];
  minimumOrderWeight: ShippingMethodFragment_minimumOrderWeight | null;
  maximumOrderWeight: ShippingMethodFragment_maximumOrderWeight | null;
  minimumDeliveryDays: number | null;
  maximumDeliveryDays: number | null;
  name: string;
  type: ShippingMethodTypeEnum | null;
  channelListings: ShippingMethodFragment_channelListings[] | null;
}
