/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CollectionDetailsFragment
// ====================================================

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
  isPublished: boolean;
  name: string;
  metadata: (CollectionDetailsFragment_metadata | null)[];
  privateMetadata: (CollectionDetailsFragment_privateMetadata | null)[];
  backgroundImage: CollectionDetailsFragment_backgroundImage | null;
  descriptionJson: any;
  publicationDate: any | null;
  seoDescription: string | null;
  seoTitle: string | null;
}
