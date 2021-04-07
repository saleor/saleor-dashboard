/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BaseChannels
// ====================================================

export interface BaseChannels_channels {
  __typename: "Channel";
  id: string;
  isActive: boolean;
  name: string;
  slug: string;
  currencyCode: string;
}

export interface BaseChannels {
  channels: BaseChannels_channels[] | null;
}
