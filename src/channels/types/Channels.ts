/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Channels
// ====================================================

export interface Channels_channels {
  __typename: "Channel";
  name: string;
  slug: string;
  id: string;
  isActive: boolean;
  currencyCode: string;
}

export interface Channels {
  channels: Channels_channels[] | null;
}
