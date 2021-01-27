/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PageInput, PageErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: PageUpdate
// ====================================================

export interface PageUpdate_pageUpdate_errors {
  __typename: "PageError";
  code: PageErrorCode;
  field: string | null;
}

export interface PageUpdate_pageUpdate_page_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageUpdate_pageUpdate_page_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageUpdate_pageUpdate_page {
  __typename: "Page";
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  metadata: (PageUpdate_pageUpdate_page_metadata | null)[];
  privateMetadata: (PageUpdate_pageUpdate_page_privateMetadata | null)[];
  contentJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  publicationDate: any | null;
}

export interface PageUpdate_pageUpdate {
  __typename: "PageUpdate";
  errors: PageUpdate_pageUpdate_errors[];
  page: PageUpdate_pageUpdate_page | null;
}

export interface PageUpdate {
  pageUpdate: PageUpdate_pageUpdate | null;
}

export interface PageUpdateVariables {
  id: string;
  input: PageInput;
}
