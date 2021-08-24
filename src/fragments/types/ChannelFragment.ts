/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ChannelFragment
// ====================================================

export interface ChannelFragment_defaultCountry {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ChannelFragment {
  __typename: "Channel";
  id: string;
  isActive: boolean;
  name: string;
  slug: string;
  currencyCode: string;
  defaultCountry: ChannelFragment_defaultCountry;
}
