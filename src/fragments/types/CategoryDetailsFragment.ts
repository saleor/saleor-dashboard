/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CategoryDetailsFragment
// ====================================================

export interface CategoryDetailsFragment_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CategoryDetailsFragment_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface CategoryDetailsFragment_backgroundImage {
  __typename: "Image";
  alt: string | null;
  url: string;
}

export interface CategoryDetailsFragment_parent {
  __typename: "Category";
  id: string;
}

export interface CategoryDetailsFragment {
  __typename: "Category";
  id: string;
  metadata: (CategoryDetailsFragment_metadata | null)[];
  privateMetadata: (CategoryDetailsFragment_privateMetadata | null)[];
  backgroundImage: CategoryDetailsFragment_backgroundImage | null;
  name: string;
  slug: string;
  descriptionJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
  parent: CategoryDetailsFragment_parent | null;
}
