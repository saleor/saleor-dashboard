/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CollectionInput, CollectionErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: CollectionUpdateWithHomepage
// ====================================================

export interface CollectionUpdateWithHomepage_collectionUpdate_collection_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
}

export interface CollectionUpdateWithHomepage_collectionUpdate_collection_channelListing {
  __typename: "CollectionChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  channel: CollectionUpdateWithHomepage_collectionUpdate_collection_channelListing_channel;
}

export interface CollectionUpdateWithHomepage_collectionUpdate_collection_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CollectionUpdateWithHomepage_collectionUpdate_collection_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CollectionUpdateWithHomepage_collectionUpdate_collection_backgroundImage {
  __typename: "Image";
  alt: string | null;
  url: string;
}

export interface CollectionUpdateWithHomepage_collectionUpdate_collection {
  __typename: "Collection";
  id: string;
  name: string;
  channelListing: CollectionUpdateWithHomepage_collectionUpdate_collection_channelListing[] | null;
  metadata: (CollectionUpdateWithHomepage_collectionUpdate_collection_metadata | null)[];
  privateMetadata: (CollectionUpdateWithHomepage_collectionUpdate_collection_privateMetadata | null)[];
  backgroundImage: CollectionUpdateWithHomepage_collectionUpdate_collection_backgroundImage | null;
  slug: string;
  descriptionJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface CollectionUpdateWithHomepage_collectionUpdate_errors {
  __typename: "CollectionError";
  code: CollectionErrorCode;
  field: string | null;
}

export interface CollectionUpdateWithHomepage_collectionUpdate {
  __typename: "CollectionUpdate";
  collection: CollectionUpdateWithHomepage_collectionUpdate_collection | null;
  errors: CollectionUpdateWithHomepage_collectionUpdate_errors[];
}

export interface CollectionUpdateWithHomepage {
  collectionUpdate: CollectionUpdateWithHomepage_collectionUpdate | null;
}

export interface CollectionUpdateWithHomepageVariables {
  id: string;
  input: CollectionInput;
}
