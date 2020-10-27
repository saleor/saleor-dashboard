/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PageTypeDetailsFragment
// ====================================================

export interface PageTypeDetailsFragment_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageTypeDetailsFragment_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageTypeDetailsFragment {
  __typename: "PageType";
  id: string;
  name: string;
  metadata: (PageTypeDetailsFragment_metadata | null)[];
  privateMetadata: (PageTypeDetailsFragment_privateMetadata | null)[];
}
