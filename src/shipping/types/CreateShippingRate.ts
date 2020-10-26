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

export interface CreateShippingRate_shippingPriceCreate_shippingZone_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_minimumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_maximumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_channels_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_channels {
  __typename: "ShippingMethodChannelListing";
  id: string;
  channel: CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_channels_channel;
  price: number | null;
  minValue: number | null;
  maxValue: number | null;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods {
  __typename: "ShippingMethod";
  id: string;
  minimumOrderPrice: CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_minimumOrderPrice | null;
  minimumOrderWeight: CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_minimumOrderWeight | null;
  maximumOrderPrice: CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_maximumOrderPrice | null;
  maximumOrderWeight: CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_maximumOrderWeight | null;
  name: string;
  price: CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_price | null;
  type: ShippingMethodTypeEnum | null;
  channels: (CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods_channels | null)[] | null;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone_warehouses {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingZone {
  __typename: "ShippingZone";
  id: string;
  countries: (CreateShippingRate_shippingPriceCreate_shippingZone_countries | null)[] | null;
  name: string;
  default: boolean;
  shippingMethods: (CreateShippingRate_shippingPriceCreate_shippingZone_shippingMethods | null)[] | null;
  warehouses: (CreateShippingRate_shippingPriceCreate_shippingZone_warehouses | null)[] | null;
}

export interface CreateShippingRate_shippingPriceCreate_shippingMethod_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingMethod_minimumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface CreateShippingRate_shippingPriceCreate_shippingMethod_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingMethod_maximumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface CreateShippingRate_shippingPriceCreate_shippingMethod_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingMethod_channels_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface CreateShippingRate_shippingPriceCreate_shippingMethod_channels {
  __typename: "ShippingMethodChannelListing";
  id: string;
  channel: CreateShippingRate_shippingPriceCreate_shippingMethod_channels_channel;
  price: number | null;
  minValue: number | null;
  maxValue: number | null;
}

export interface CreateShippingRate_shippingPriceCreate_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
  minimumOrderPrice: CreateShippingRate_shippingPriceCreate_shippingMethod_minimumOrderPrice | null;
  minimumOrderWeight: CreateShippingRate_shippingPriceCreate_shippingMethod_minimumOrderWeight | null;
  maximumOrderPrice: CreateShippingRate_shippingPriceCreate_shippingMethod_maximumOrderPrice | null;
  maximumOrderWeight: CreateShippingRate_shippingPriceCreate_shippingMethod_maximumOrderWeight | null;
  name: string;
  price: CreateShippingRate_shippingPriceCreate_shippingMethod_price | null;
  type: ShippingMethodTypeEnum | null;
  channels: (CreateShippingRate_shippingPriceCreate_shippingMethod_channels | null)[] | null;
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
