/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PostalCodeRuleInclusionTypeEnum, WeightUnitsEnum, ShippingMethodTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ShippingMethodTypeFragment
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

export interface ShippingMethodTypeFragment {
  __typename: "ShippingMethodType";
  id: string;
  postalCodeRules: (ShippingMethodTypeFragment_postalCodeRules | null)[] | null;
  metadata: (ShippingMethodTypeFragment_metadata | null)[];
  privateMetadata: (ShippingMethodTypeFragment_privateMetadata | null)[];
  minimumOrderWeight: ShippingMethodTypeFragment_minimumOrderWeight | null;
  maximumOrderWeight: ShippingMethodTypeFragment_maximumOrderWeight | null;
  minimumDeliveryDays: number | null;
  maximumDeliveryDays: number | null;
  name: string;
  description: any | null;
  type: ShippingMethodTypeEnum | null;
  channelListings: ShippingMethodTypeFragment_channelListings[] | null;
}
