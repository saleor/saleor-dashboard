/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PageTypeCreateInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: PageTypeCreate
// ====================================================

export interface PageTypeCreate_pageTypeCreate_errors {
  __typename: "PageError";
  field: string | null;
  message: string | null;
}

export interface PageTypeCreate_pageTypeCreate_pageType_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageTypeCreate_pageTypeCreate_pageType_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface PageTypeCreate_pageTypeCreate_pageType {
  __typename: "PageType";
  id: string;
  name: string;
  metadata: (PageTypeCreate_pageTypeCreate_pageType_metadata | null)[];
  privateMetadata: (PageTypeCreate_pageTypeCreate_pageType_privateMetadata | null)[];
}

export interface PageTypeCreate_pageTypeCreate {
  __typename: "PageTypeCreate";
  errors: PageTypeCreate_pageTypeCreate_errors[];
  pageType: PageTypeCreate_pageTypeCreate_pageType | null;
}

export interface PageTypeCreate {
  pageTypeCreate: PageTypeCreate_pageTypeCreate | null;
}

export interface PageTypeCreateVariables {
  input: PageTypeCreateInput;
}
