/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WeightUnitsEnum, ShippingMethodTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ShippingZoneDetailsFragment
// ====================================================

export interface ShippingZoneDetailsFragment_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ShippingZoneDetailsFragment_shippingMethods_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneDetailsFragment_shippingMethods_minimumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingZoneDetailsFragment_shippingMethods_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneDetailsFragment_shippingMethods_maximumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingZoneDetailsFragment_shippingMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneDetailsFragment_shippingMethods_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ShippingZoneDetailsFragment_shippingMethods_channelListing_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneDetailsFragment_shippingMethods_channelListing_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneDetailsFragment_shippingMethods_channelListing_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZoneDetailsFragment_shippingMethods_channelListing {
  __typename: "ShippingMethodChannelListing";
  id: string;
  channel: ShippingZoneDetailsFragment_shippingMethods_channelListing_channel;
  price: ShippingZoneDetailsFragment_shippingMethods_channelListing_price | null;
  minimumOrderPrice: ShippingZoneDetailsFragment_shippingMethods_channelListing_minimumOrderPrice | null;
  maximumOrderPrice: ShippingZoneDetailsFragment_shippingMethods_channelListing_maximumOrderPrice | null;
}

export interface ShippingZoneDetailsFragment_shippingMethods {
  __typename: "ShippingMethod";
  id: string;
  minimumOrderPrice: ShippingZoneDetailsFragment_shippingMethods_minimumOrderPrice | null;
  minimumOrderWeight: ShippingZoneDetailsFragment_shippingMethods_minimumOrderWeight | null;
  maximumOrderPrice: ShippingZoneDetailsFragment_shippingMethods_maximumOrderPrice | null;
  maximumOrderWeight: ShippingZoneDetailsFragment_shippingMethods_maximumOrderWeight | null;
  name: string;
  price: ShippingZoneDetailsFragment_shippingMethods_price | null;
  type: ShippingMethodTypeEnum | null;
  channelListing: ShippingZoneDetailsFragment_shippingMethods_channelListing[] | null;
}

export interface ShippingZoneDetailsFragment_warehouses {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ShippingZoneDetailsFragment {
  __typename: "ShippingZone";
  id: string;
  countries: (ShippingZoneDetailsFragment_countries | null)[] | null;
  name: string;
  default: boolean;
  shippingMethods: (ShippingZoneDetailsFragment_shippingMethods | null)[] | null;
  warehouses: (ShippingZoneDetailsFragment_warehouses | null)[] | null;
}
