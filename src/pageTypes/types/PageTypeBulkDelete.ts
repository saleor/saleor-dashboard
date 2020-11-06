/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PageTypeBulkDelete
// ====================================================

export interface PageTypeBulkDelete_pageTypeBulkDelete_errors {
  __typename: "PageError";
  field: string | null;
  message: string | null;
}

export interface PageTypeBulkDelete_pageTypeBulkDelete {
  __typename: "PageTypeBulkDelete";
  errors: PageTypeBulkDelete_pageTypeBulkDelete_errors[];
}

export interface PageTypeBulkDelete {
  pageTypeBulkDelete: PageTypeBulkDelete_pageTypeBulkDelete | null;
}

export interface PageTypeBulkDeleteVariables {
  ids: string[];
}
