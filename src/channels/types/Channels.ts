/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Channels
// ====================================================

export interface Channels_channels {
  __typename: "Channel";
  id: string;
  isActive: boolean;
  name: string;
  slug: string;
  currencyCode: string;
}

export interface Channels {
  channels: Channels_channels[] | null;
}
