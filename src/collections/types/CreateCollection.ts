/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CollectionCreateInput, CollectionErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: CreateCollection
// ====================================================

export interface CreateCollection_collectionCreate_collection_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
}

export interface CreateCollection_collectionCreate_collection_channelListings {
  __typename: "CollectionChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  channel: CreateCollection_collectionCreate_collection_channelListings_channel;
}

export interface CreateCollection_collectionCreate_collection_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CreateCollection_collectionCreate_collection_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CreateCollection_collectionCreate_collection_backgroundImage {
  __typename: "Image";
  alt: string | null;
  url: string;
}

export interface CreateCollection_collectionCreate_collection {
  __typename: "Collection";
  id: string;
  name: string;
  channelListings: CreateCollection_collectionCreate_collection_channelListings[] | null;
  metadata: (CreateCollection_collectionCreate_collection_metadata | null)[];
  privateMetadata: (CreateCollection_collectionCreate_collection_privateMetadata | null)[];
  backgroundImage: CreateCollection_collectionCreate_collection_backgroundImage | null;
  slug: string;
  descriptionJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface CreateCollection_collectionCreate_errors {
  __typename: "CollectionError";
  code: CollectionErrorCode;
  field: string | null;
}

export interface CreateCollection_collectionCreate {
  __typename: "CollectionCreate";
  collection: CreateCollection_collectionCreate_collection | null;
  errors: CreateCollection_collectionCreate_errors[];
}

export interface CreateCollection {
  collectionCreate: CreateCollection_collectionCreate | null;
}

export interface CreateCollectionVariables {
  input: CollectionCreateInput;
}
