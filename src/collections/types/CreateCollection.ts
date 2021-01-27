/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CollectionCreateInput, ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: CreateCollection
// ====================================================

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
  isPublished: boolean;
  name: string;
  metadata: (CreateCollection_collectionCreate_collection_metadata | null)[];
  privateMetadata: (CreateCollection_collectionCreate_collection_privateMetadata | null)[];
  backgroundImage: CreateCollection_collectionCreate_collection_backgroundImage | null;
  slug: string;
  descriptionJson: any;
  publicationDate: any | null;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface CreateCollection_collectionCreate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
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
