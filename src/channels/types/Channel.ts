/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Channel
// ====================================================

export interface Channel_channel {
  __typename: "Channel";
  id: string;
  isActive: boolean;
  name: string;
  slug: string;
  currencyCode: string;
}

export interface Channel {
  channel: Channel_channel | null;
}

export interface ChannelVariables {
  id: string;
}
