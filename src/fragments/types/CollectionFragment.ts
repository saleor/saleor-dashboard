/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CollectionFragment
// ====================================================

export interface CollectionFragment_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
}

export interface CollectionFragment_channelListing {
  __typename: "CollectionChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  channel: CollectionFragment_channelListing_channel;
}

export interface CollectionFragment {
  __typename: "Collection";
  id: string;
  name: string;
  channelListing: CollectionFragment_channelListing[] | null;
}
