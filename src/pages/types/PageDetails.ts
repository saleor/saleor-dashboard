/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PageDetails
// ====================================================

export interface PageDetails_page_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageDetails_page_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageDetails_page {
  __typename: "Page";
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  metadata: (PageDetails_page_metadata | null)[];
  privateMetadata: (PageDetails_page_privateMetadata | null)[];
  contentJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  publicationDate: any | null;
}

export interface PageDetails {
  page: PageDetails_page | null;
}

export interface PageDetailsVariables {
  id: string;
}
