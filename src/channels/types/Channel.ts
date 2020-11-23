/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Channel
// ====================================================

export interface Channel_channel {
  __typename: "Channel";
  name: string;
  slug: string;
  id: string;
  isActive: boolean;
  currencyCode: string;
}

export interface Channel {
  channel: Channel_channel | null;
}

export interface ChannelVariables {
  id: string;
}
