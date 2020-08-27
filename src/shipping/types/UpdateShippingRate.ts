/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ShippingPriceInput, ShippingErrorCode, WeightUnitsEnum, ShippingMethodTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateShippingRate
// ====================================================

export interface UpdateShippingRate_shippingPriceUpdate_errors {
  __typename: "ShippingError";
  code: ShippingErrorCode;
  field: string | null;
}

export interface UpdateShippingRate_shippingPriceUpdate_shippingMethod_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface UpdateShippingRate_shippingPriceUpdate_shippingMethod_minimumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface UpdateShippingRate_shippingPriceUpdate_shippingMethod_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface UpdateShippingRate_shippingPriceUpdate_shippingMethod_maximumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface UpdateShippingRate_shippingPriceUpdate_shippingMethod_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface UpdateShippingRate_shippingPriceUpdate_shippingMethod_channels_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface UpdateShippingRate_shippingPriceUpdate_shippingMethod_channels {
  __typename: "ShippingMethodChannelListing";
  id: string;
  channel: UpdateShippingRate_shippingPriceUpdate_shippingMethod_channels_channel;
  price: number | null;
  minValue: number | null;
  maxValue: number | null;
}

export interface UpdateShippingRate_shippingPriceUpdate_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
  minimumOrderPrice: UpdateShippingRate_shippingPriceUpdate_shippingMethod_minimumOrderPrice | null;
  minimumOrderWeight: UpdateShippingRate_shippingPriceUpdate_shippingMethod_minimumOrderWeight | null;
  maximumOrderPrice: UpdateShippingRate_shippingPriceUpdate_shippingMethod_maximumOrderPrice | null;
  maximumOrderWeight: UpdateShippingRate_shippingPriceUpdate_shippingMethod_maximumOrderWeight | null;
  name: string;
  price: UpdateShippingRate_shippingPriceUpdate_shippingMethod_price | null;
  type: ShippingMethodTypeEnum | null;
  channels: (UpdateShippingRate_shippingPriceUpdate_shippingMethod_channels | null)[] | null;
}

export interface UpdateShippingRate_shippingPriceUpdate {
  __typename: "ShippingPriceUpdate";
  errors: UpdateShippingRate_shippingPriceUpdate_errors[];
  shippingMethod: UpdateShippingRate_shippingPriceUpdate_shippingMethod | null;
}

export interface UpdateShippingRate {
  shippingPriceUpdate: UpdateShippingRate_shippingPriceUpdate | null;
}

export interface UpdateShippingRateVariables {
  id: string;
  input: ShippingPriceInput;
}
