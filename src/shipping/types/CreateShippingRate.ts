/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ShippingPriceInput, ShippingErrorCode, WeightUnitsEnum, ShippingMethodTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: CreateShippingRate
// ====================================================

export interface CreateShippingRate_shippingPriceCreate_errors {
  __typename: "ShippingError";
  code: ShippingErrorCode;
  field: string | null;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_zipCodeRules {
  __typename: "ShippingMethodZipCodeRule";
  id: string;
  start: string | null;
  end: string | null;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_minimumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_maximumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_channelListings_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_channelListings_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_channelListings {
  __typename: "ShippingMethodChannelListing";
  id: string;
  channel: CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_channelListings_channel;
  price: CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_channelListings_price | null;
  minimumOrderPrice: CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_channelListings_minimumOrderPrice | null;
  maximumOrderPrice: CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_channelListings_maximumOrderPrice | null;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods {
  __typename: "ShippingMethod";
  id: string;
  zipCodeRules: (CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_zipCodeRules | null)[] | null;
  metadata: (CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_metadata | null)[];
  privateMetadata: (CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_privateMetadata | null)[];
  minimumOrderWeight: CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_minimumOrderWeight | null;
  maximumOrderWeight: CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_maximumOrderWeight | null;
  name: string;
  type: ShippingMethodTypeEnum | null;
  channelListings: CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_channelListings[] | null;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_warehouses {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone {
  __typename: "ShippingZone";
  metadata: (CreateShippingRate_shippingPriceCreate_shippingZone_metadata | null)[];
  privateMetadata: (CreateShippingRate_shippingPriceCreate_shippingZone_privateMetadata | null)[];
  id: string;
  countries: (CreateShippingRate_shippingPriceCreate_shippingZone_countries | null)[] | null;
  name: string;
  default: boolean;
  shippingMethods: (CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods | null)[] | null;
  warehouses: (CreateShippingRate_shippingPriceCreate_shippingZone_warehouses | null)[] | null;
}

export interface CreateShippingRate_shippingPriceCreate_shippingMethod_zipCodeRules {
  __typename: "ShippingMethodZipCodeRule";
  id: string;
  start: string | null;
  end: string | null;
}

export interface CreateShippingRate_shippingPriceCreate_shippingMethod_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingMethod_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingMethod_minimumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface CreateShippingRate_shippingPriceCreate_shippingMethod_maximumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface CreateShippingRate_shippingPriceCreate_shippingMethod_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingMethod_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingMethod_channelListings_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingMethod_channelListings_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingMethod_channelListings {
  __typename: "ShippingMethodChannelListing";
  id: string;
  channel: CreateShippingRate_shippingPriceCreate_shippingMethod_channelListings_channel;
  price: CreateShippingRate_shippingPriceCreate_shippingMethod_channelListings_price | null;
  minimumOrderPrice: CreateShippingRate_shippingPriceCreate_shippingMethod_channelListings_minimumOrderPrice | null;
  maximumOrderPrice: CreateShippingRate_shippingPriceCreate_shippingMethod_channelListings_maximumOrderPrice | null;
}

export interface CreateShippingRate_shippingPriceCreate_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
  zipCodeRules: (CreateShippingRate_shippingPriceCreate_shippingMethod_zipCodeRules | null)[] | null;
  metadata: (CreateShippingRate_shippingPriceCreate_shippingMethod_metadata | null)[];
  privateMetadata: (CreateShippingRate_shippingPriceCreate_shippingMethod_privateMetadata | null)[];
  minimumOrderWeight: CreateShippingRate_shippingPriceCreate_shippingMethod_minimumOrderWeight | null;
  maximumOrderWeight: CreateShippingRate_shippingPriceCreate_shippingMethod_maximumOrderWeight | null;
  name: string;
  type: ShippingMethodTypeEnum | null;
  channelListings: CreateShippingRate_shippingPriceCreate_shippingMethod_channelListings[] | null;
}

export interface CreateShippingRate_shippingPriceCreate {
  __typename: "ShippingPriceCreate";
  errors: CreateShippingRate_shippingPriceCreate_errors[];
  shippingZone: CreateShippingRate_shippingPriceCreate_shippingZone | null;
  shippingMethod: CreateShippingRate_shippingPriceCreate_shippingMethod | null;
}

export interface CreateShippingRate {
  shippingPriceCreate: CreateShippingRate_shippingPriceCreate | null;
}

export interface CreateShippingRateVariables {
  input: ShippingPriceInput;
}
