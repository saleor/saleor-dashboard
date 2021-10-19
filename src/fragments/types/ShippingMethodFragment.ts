/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PostalCodeRuleInclusionTypeEnum, WeightUnitsEnum, ShippingMethodTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ShippingMethodFragment
// ====================================================

export interface ShippingMethodTypeFragment_postalCodeRules {
  __typename: "ShippingMethodPostalCodeRule";
  id: string;
  inclusionType: PostalCodeRuleInclusionTypeEnum | null;
  start: string | null;
  end: string | null;
}

export interface ShippingMethodTypeFragment_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ShippingMethodTypeFragment_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ShippingMethodTypeFragment_minimumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingMethodTypeFragment_maximumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingMethodTypeFragment_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ShippingMethodTypeFragment_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingMethodTypeFragment_channelListings_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingMethodTypeFragment_channelListings_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingMethodTypeFragment_channelListings {
  __typename: "ShippingMethodChannelListing";
  id: string;
  channel: ShippingMethodTypeFragment_channelListings_channel;
  price: ShippingMethodTypeFragment_channelListings_price | null;
  minimumOrderPrice: ShippingMethodTypeFragment_channelListings_minimumOrderPrice | null;
  maximumOrderPrice: ShippingMethodTypeFragment_channelListings_maximumOrderPrice | null;
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
  description: any | null;
  type: ShippingMethodTypeEnum | null;
  channelListings: ShippingMethodFragment_channelListings[] | null;
}
