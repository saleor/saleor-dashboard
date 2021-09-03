/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ChannelDetailsFragment
// ====================================================

export interface ChannelDetailsFragment_defaultCountry {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ChannelDetailsFragment {
  __typename: "Channel";
  id: string;
  isActive: boolean;
  name: string;
  slug: string;
  currencyCode: string;
  defaultCountry: ChannelDetailsFragment_defaultCountry;
  hasOrders: boolean;
}
