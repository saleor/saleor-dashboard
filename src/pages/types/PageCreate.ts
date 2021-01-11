/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PageInput, PageErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: PageCreate
// ====================================================

export interface PageCreate_pageCreate_errors {
  __typename: "PageError";
  code: PageErrorCode;
  field: string | null;
}

export interface PageCreate_pageCreate_page_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageCreate_pageCreate_page_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageCreate_pageCreate_page {
  __typename: "Page";
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  metadata: (PageCreate_pageCreate_page_metadata | null)[];
  privateMetadata: (PageCreate_pageCreate_page_privateMetadata | null)[];
  contentJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  publicationDate: any | null;
}

export interface PageCreate_pageCreate {
  __typename: "PageCreate";
  errors: PageCreate_pageCreate_errors[];
  page: PageCreate_pageCreate_page | null;
}

export interface PageCreate {
  pageCreate: PageCreate_pageCreate | null;
}

export interface PageCreateVariables {
  input: PageInput;
}
