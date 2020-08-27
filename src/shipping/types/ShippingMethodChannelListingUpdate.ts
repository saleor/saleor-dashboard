/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ShippingMethodChannelListingInput, WeightUnitsEnum, ShippingMethodTypeEnum, ShippingErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ShippingMethodChannelListingUpdate
// ====================================================

export interface ShippingMethodChannelListingUpdate_shippingMethodChannelListingUpdate_shippingMethod_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingMethodChannelListingUpdate_shippingMethodChannelListingUpdate_shippingMethod_minimumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingMethodChannelListingUpdate_shippingMethodChannelListingUpdate_shippingMethod_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingMethodChannelListingUpdate_shippingMethodChannelListingUpdate_shippingMethod_maximumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ShippingMethodChannelListingUpdate_shippingMethodChannelListingUpdate_shippingMethod_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ShippingMethodChannelListingUpdate_shippingMethodChannelListingUpdate_shippingMethod_channels_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ShippingMethodChannelListingUpdate_shippingMethodChannelListingUpdate_shippingMethod_channels {
  __typename: "ShippingMethodChannelListing";
  id: string;
  channel: ShippingMethodChannelListingUpdate_shippingMethodChannelListingUpdate_shippingMethod_channels_channel;
  price: number | null;
  minValue: number | null;
  maxValue: number | null;
}

export interface ShippingMethodChannelListingUpdate_shippingMethodChannelListingUpdate_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
  minimumOrderPrice: ShippingMethodChannelListingUpdate_shippingMethodChannelListingUpdate_shippingMethod_minimumOrderPrice | null;
  minimumOrderWeight: ShippingMethodChannelListingUpdate_shippingMethodChannelListingUpdate_shippingMethod_minimumOrderWeight | null;
  maximumOrderPrice: ShippingMethodChannelListingUpdate_shippingMethodChannelListingUpdate_shippingMethod_maximumOrderPrice | null;
  maximumOrderWeight: ShippingMethodChannelListingUpdate_shippingMethodChannelListingUpdate_shippingMethod_maximumOrderWeight | null;
  name: string;
  price: ShippingMethodChannelListingUpdate_shippingMethodChannelListingUpdate_shippingMethod_price | null;
  type: ShippingMethodTypeEnum | null;
  channels: (ShippingMethodChannelListingUpdate_shippingMethodChannelListingUpdate_shippingMethod_channels | null)[] | null;
}

export interface ShippingMethodChannelListingUpdate_shippingMethodChannelListingUpdate_errors {
  __typename: "ShippingError";
  code: ShippingErrorCode;
  field: string | null;
}

export interface ShippingMethodChannelListingUpdate_shippingMethodChannelListingUpdate {
  __typename: "ShippingMethodChannelListingUpdate";
  shippingMethod: ShippingMethodChannelListingUpdate_shippingMethodChannelListingUpdate_shippingMethod | null;
  errors: ShippingMethodChannelListingUpdate_shippingMethodChannelListingUpdate_errors[];
}

export interface ShippingMethodChannelListingUpdate {
  shippingMethodChannelListingUpdate: ShippingMethodChannelListingUpdate_shippingMethodChannelListingUpdate | null;
}

export interface ShippingMethodChannelListingUpdateVariables {
  id: string;
  input: ShippingMethodChannelListingInput;
}
