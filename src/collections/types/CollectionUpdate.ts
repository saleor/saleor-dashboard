/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CollectionInput, ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: CollectionUpdate
// ====================================================

export interface CollectionUpdate_collectionUpdate_collection_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CollectionUpdate_collectionUpdate_collection_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CollectionUpdate_collectionUpdate_collection_backgroundImage {
  __typename: "Image";
  alt: string | null;
  url: string;
}

export interface CollectionUpdate_collectionUpdate_collection {
  __typename: "Collection";
  id: string;
  isPublished: boolean;
  name: string;
  metadata: (CollectionUpdate_collectionUpdate_collection_metadata | null)[];
  privateMetadata: (CollectionUpdate_collectionUpdate_collection_privateMetadata | null)[];
  backgroundImage: CollectionUpdate_collectionUpdate_collection_backgroundImage | null;
  slug: string;
  descriptionJson: any;
  publicationDate: any | null;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface CollectionUpdate_collectionUpdate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface CollectionUpdate_collectionUpdate {
  __typename: "CollectionUpdate";
  collection: CollectionUpdate_collectionUpdate_collection | null;
  errors: CollectionUpdate_collectionUpdate_errors[];
}

export interface CollectionUpdate {
  collectionUpdate: CollectionUpdate_collectionUpdate | null;
}

export interface CollectionUpdateVariables {
  id: string;
  input: CollectionInput;
}
