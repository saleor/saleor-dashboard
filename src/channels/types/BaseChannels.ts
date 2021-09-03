/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BaseChannels
// ====================================================

export interface BaseChannels_channels_defaultCountry {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface BaseChannels_channels {
  __typename: "Channel";
  id: string;
  isActive: boolean;
  name: string;
  slug: string;
  currencyCode: string;
  defaultCountry: BaseChannels_channels_defaultCountry;
}

export interface BaseChannels {
  channels: BaseChannels_channels[] | null;
}
