/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ShippingPriceInput, ShippingErrorCode, PostalCodeRuleInclusionTypeEnum, WeightUnitsEnum, ShippingMethodTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateShippingRate
// ====================================================

export interface UpdateShippingRate_shippingPriceUpdate_errors {
  __typename: "ShippingError";
  code: ShippingErrorCode;
  field: string | null;
}

export interface UpdateShippingRate_shippingPriceUpdate_shippingMethod_postalCodeRules {
  __typename: "ShippingMethodPostalCodeRule";
  id: string;
  inclusionType: PostalCodeRuleInclusionTypeEnum | null;
  start: string | null;
  end: string | null;
}

export interface UpdateShippingRate_shippingPriceUpdate_shippingMethod_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface UpdateShippingRate_shippingPriceUpdate_shippingMethod_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface UpdateShippingRate_shippingPriceUpdate_shippingMethod_minimumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface UpdateShippingRate_shippingPriceUpdate_shippingMethod_maximumOrderWeight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface UpdateShippingRate_shippingPriceUpdate_shippingMethod_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface UpdateShippingRate_shippingPriceUpdate_shippingMethod_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface UpdateShippingRate_shippingPriceUpdate_shippingMethod_channelListings_minimumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface UpdateShippingRate_shippingPriceUpdate_shippingMethod_channelListings_maximumOrderPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface UpdateShippingRate_shippingPriceUpdate_shippingMethod_channelListings {
  __typename: "ShippingMethodChannelListing";
  id: string;
  channel: UpdateShippingRate_shippingPriceUpdate_shippingMethod_channelListings_channel;
  price: UpdateShippingRate_shippingPriceUpdate_shippingMethod_channelListings_price | null;
  minimumOrderPrice: UpdateShippingRate_shippingPriceUpdate_shippingMethod_channelListings_minimumOrderPrice | null;
  maximumOrderPrice: UpdateShippingRate_shippingPriceUpdate_shippingMethod_channelListings_maximumOrderPrice | null;
}

export interface UpdateShippingRate_shippingPriceUpdate_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
  postalCodeRules: (UpdateShippingRate_shippingPriceUpdate_shippingMethod_postalCodeRules | null)[] | null;
  metadata: (UpdateShippingRate_shippingPriceUpdate_shippingMethod_metadata | null)[];
  privateMetadata: (UpdateShippingRate_shippingPriceUpdate_shippingMethod_privateMetadata | null)[];
  minimumOrderWeight: UpdateShippingRate_shippingPriceUpdate_shippingMethod_minimumOrderWeight | null;
  maximumOrderWeight: UpdateShippingRate_shippingPriceUpdate_shippingMethod_maximumOrderWeight | null;
  minimumDeliveryDays: number | null;
  maximumDeliveryDays: number | null;
  name: string;
  type: ShippingMethodTypeEnum | null;
  channelListings: UpdateShippingRate_shippingPriceUpdate_shippingMethod_channelListings[] | null;
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
