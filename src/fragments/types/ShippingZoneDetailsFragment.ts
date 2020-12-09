/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WeightUnitsEnum, ShippingMethodTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ShippingZoneDetailsFragment
// ====================================================

export interface ShippingZoneDetailsFragment_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ShippingZoneDetailsFragment_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ShippingZoneDetailsFragment_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ShippingZoneDetailsFragment_shippingMethods_zipCodeRules {
  __typename: "ShippingMethodZipCodeRule";
  id: string;
  start: string | null;
  end: string | null;
}

export interface ShippingZoneDetailsFragment_shippingMethods_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ShippingZoneDetailsFragment_shippingMethods_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ShippingZoneDetailsFragment_shippingMethods_minimumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingZoneDetailsFragment_shippingMethods_maximumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingZoneDetailsFragment_shippingMethods_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ShippingZoneDetailsFragment_shippingMethods_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneDetailsFragment_shippingMethods_channelListings_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneDetailsFragment_shippingMethods_channelListings_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneDetailsFragment_shippingMethods_channelListings {
  __typename: "ShippingMethodChannelListing";
  id: string;
  channel: ShippingZoneDetailsFragment_shippingMethods_channelListings_channel;
  price: ShippingZoneDetailsFragment_shippingMethods_channelListings_price | null;
  minimumOrderPrice: ShippingZoneDetailsFragment_shippingMethods_channelListings_minimumOrderPrice | null;
  maximumOrderPrice: ShippingZoneDetailsFragment_shippingMethods_channelListings_maximumOrderPrice | null;
}

export interface ShippingZoneDetailsFragment_shippingMethods {
  __typename: "ShippingMethod";
  id: string;
  zipCodeRules: (ShippingZoneDetailsFragment_shippingMethods_zipCodeRules | null)[] | null;
  metadata: (ShippingZoneDetailsFragment_shippingMethods_metadata | null)[];
  privateMetadata: (ShippingZoneDetailsFragment_shippingMethods_privateMetadata | null)[];
  minimumOrderWeight: ShippingZoneDetailsFragment_shippingMethods_minimumOrderWeight | null;
  maximumOrderWeight: ShippingZoneDetailsFragment_shippingMethods_maximumOrderWeight | null;
  name: string;
  type: ShippingMethodTypeEnum | null;
  channelListings: ShippingZoneDetailsFragment_shippingMethods_channelListings[] | null;
}

export interface ShippingZoneDetailsFragment_warehouses {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ShippingZoneDetailsFragment {
  __typename: "ShippingZone";
  metadata: (ShippingZoneDetailsFragment_metadata | null)[];
  privateMetadata: (ShippingZoneDetailsFragment_privateMetadata | null)[];
  id: string;
  countries: (ShippingZoneDetailsFragment_countries | null)[] | null;
  name: string;
  default: boolean;
  shippingMethods: (ShippingZoneDetailsFragment_shippingMethods | null)[] | null;
  warehouses: (ShippingZoneDetailsFragment_warehouses | null)[] | null;
}
