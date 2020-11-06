/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CollectionFragment
// ====================================================

export interface CollectionFragment_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
}

export interface CollectionFragment_channelListings {
  __typename: "CollectionChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  channel: CollectionFragment_channelListings_channel;
}

export interface CollectionFragment {
  __typename: "Collection";
  id: string;
  name: string;
  channelListings: CollectionFragment_channelListings[] | null;
}
