/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PageTypeDetails
// ====================================================

export interface PageTypeDetails_pageType_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageTypeDetails_pageType_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageTypeDetails_pageType {
  __typename: "PageType";
  id: string;
  name: string;
  metadata: (PageTypeDetails_pageType_metadata | null)[];
  privateMetadata: (PageTypeDetails_pageType_privateMetadata | null)[];
}

export interface PageTypeDetails {
  pageType: PageTypeDetails_pageType | null;
}

export interface PageTypeDetailsVariables {
  id: string;
}
