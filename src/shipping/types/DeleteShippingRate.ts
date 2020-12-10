/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ShippingErrorCode, WeightUnitsEnum, ShippingMethodTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteShippingRate
// ====================================================

export interface DeleteShippingRate_shippingPriceDelete_errors {
  __typename: "ShippingError";
  code: ShippingErrorCode;
  field: string | null;
}

export interface DeleteShippingRate_shippingPriceDelete_shippingZone_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface DeleteShippingRate_shippingPriceDelete_shippingZone_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface DeleteShippingRate_shippingPriceDelete_shippingZone_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods_zipCodeRules {
  __typename: "ShippingMethodZipCodeRule";
  id: string;
  start: string | null;
  end: string | null;
}

export interface DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods_minimumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods_maximumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods_channelListings_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods_channelListings_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods_channelListings {
  __typename: "ShippingMethodChannelListing";
  id: string;
  channel: DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods_channelListings_channel;
  price: DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods_channelListings_price | null;
  minimumOrderPrice: DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods_channelListings_minimumOrderPrice | null;
  maximumOrderPrice: DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods_channelListings_maximumOrderPrice | null;
}

export interface DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods {
  __typename: "ShippingMethod";
  id: string;
  zipCodeRules: (DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods_zipCodeRules | null)[] | null;
  metadata: (DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods_metadata | null)[];
  privateMetadata: (DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods_privateMetadata | null)[];
  minimumOrderWeight: DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods_minimumOrderWeight | null;
  maximumOrderWeight: DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods_maximumOrderWeight | null;
  name: string;
  type: ShippingMethodTypeEnum | null;
  channelListings: DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods_channelListings[] | null;
}

export interface DeleteShippingRate_shippingPriceDelete_shippingZone_warehouses {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface DeleteShippingRate_shippingPriceDelete_shippingZone {
  __typename: "ShippingZone";
  metadata: (DeleteShippingRate_shippingPriceDelete_shippingZone_metadata | null)[];
  privateMetadata: (DeleteShippingRate_shippingPriceDelete_shippingZone_privateMetadata | null)[];
  id: string;
  countries: (DeleteShippingRate_shippingPriceDelete_shippingZone_countries | null)[] | null;
  name: string;
  default: boolean;
  shippingMethods: (DeleteShippingRate_shippingPriceDelete_shippingZone_shippingMethods | null)[] | null;
  warehouses: (DeleteShippingRate_shippingPriceDelete_shippingZone_warehouses | null)[] | null;
}

export interface DeleteShippingRate_shippingPriceDelete {
  __typename: "ShippingPriceDelete";
  errors: DeleteShippingRate_shippingPriceDelete_errors[];
  shippingZone: DeleteShippingRate_shippingPriceDelete_shippingZone | null;
}

export interface DeleteShippingRate {
  shippingPriceDelete: DeleteShippingRate_shippingPriceDelete | null;
}

export interface DeleteShippingRateVariables {
  id: string;
}
