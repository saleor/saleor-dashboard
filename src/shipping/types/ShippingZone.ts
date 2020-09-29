/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WeightUnitsEnum, ShippingMethodTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ShippingZone
// ====================================================

export interface ShippingZone_shippingZone_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ShippingZone_shippingZone_shippingMethods_minimumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingZone_shippingZone_shippingMethods_maximumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingZone_shippingZone_shippingMethods_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ShippingZone_shippingZone_shippingMethods_channelListing_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZone_shippingZone_shippingMethods_channelListing_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZone_shippingZone_shippingMethods_channelListing_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingZone_shippingZone_shippingMethods_channelListing {
  __typename: "ShippingMethodChannelListing";
  id: string;
  channel: ShippingZone_shippingZone_shippingMethods_channelListing_channel;
  price: ShippingZone_shippingZone_shippingMethods_channelListing_price | null;
  minimumOrderPrice: ShippingZone_shippingZone_shippingMethods_channelListing_minimumOrderPrice | null;
  maximumOrderPrice: ShippingZone_shippingZone_shippingMethods_channelListing_maximumOrderPrice | null;
}

export interface ShippingZone_shippingZone_shippingMethods {
  __typename: "ShippingMethod";
  id: string;
  minimumOrderWeight: ShippingZone_shippingZone_shippingMethods_minimumOrderWeight | null;
  maximumOrderWeight: ShippingZone_shippingZone_shippingMethods_maximumOrderWeight | null;
  name: string;
  type: ShippingMethodTypeEnum | null;
  channelListing: ShippingZone_shippingZone_shippingMethods_channelListing[] | null;
}

export interface ShippingZone_shippingZone_warehouses {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ShippingZone_shippingZone {
  __typename: "ShippingZone";
  id: string;
  countries: (ShippingZone_shippingZone_countries | null)[] | null;
  name: string;
  default: boolean;
  shippingMethods: (ShippingZone_shippingZone_shippingMethods | null)[] | null;
  warehouses: (ShippingZone_shippingZone_warehouses | null)[] | null;
}

export interface ShippingZone {
  shippingZone: ShippingZone_shippingZone | null;
}

export interface ShippingZoneVariables {
  id: string;
}
