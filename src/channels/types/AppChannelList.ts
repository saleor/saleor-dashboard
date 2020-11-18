/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AppChannelList
// ====================================================

export interface AppChannelList_channels {
  __typename: "Channel";
  id: string;
  name: string;
}

export interface AppChannelList {
  channels: AppChannelList_channels[] | null;
}
