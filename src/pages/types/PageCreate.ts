/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PageCreateInput, PageErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: PageCreate
// ====================================================

export interface PageCreate_pageCreate_errors {
  __typename: "PageError";
  code: PageErrorCode;
  field: string | null;
  attributes: string[] | null;
  message: string | null;
}

export interface PageCreate_pageCreate_page {
  __typename: "Page";
  id: string;
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
  input: PageCreateInput;
}
