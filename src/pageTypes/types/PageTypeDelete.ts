/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PageTypeDelete
// ====================================================

export interface PageTypeDelete_pageTypeDelete_errors {
  __typename: "PageError";
  field: string | null;
  message: string | null;
}

export interface PageTypeDelete_pageTypeDelete_pageType {
  __typename: "PageType";
  id: string;
}

export interface PageTypeDelete_pageTypeDelete {
  __typename: "PageTypeDelete";
  errors: PageTypeDelete_pageTypeDelete_errors[];
  pageType: PageTypeDelete_pageTypeDelete_pageType | null;
}

export interface PageTypeDelete {
  pageTypeDelete: PageTypeDelete_pageTypeDelete | null;
}

export interface PageTypeDeleteVariables {
  id: string;
}
