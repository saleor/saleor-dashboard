/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CollectionDetailsFragment
// ====================================================

export interface CollectionDetailsFragment_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
}

export interface CollectionDetailsFragment_channelListings {
  __typename: "CollectionChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  channel: CollectionDetailsFragment_channelListings_channel;
}

export interface CollectionDetailsFragment_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CollectionDetailsFragment_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CollectionDetailsFragment_backgroundImage {
  __typename: "Image";
  alt: string | null;
  url: string;
}

export interface CollectionDetailsFragment {
  __typename: "Collection";
  id: string;
  name: string;
  channelListings: CollectionDetailsFragment_channelListings[] | null;
  metadata: (CollectionDetailsFragment_metadata | null)[];
  privateMetadata: (CollectionDetailsFragment_privateMetadata | null)[];
  backgroundImage: CollectionDetailsFragment_backgroundImage | null;
  slug: string;
  descriptionJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
}
