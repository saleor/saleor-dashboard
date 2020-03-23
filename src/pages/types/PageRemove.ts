/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PageErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: PageRemove
// ====================================================

export interface PageRemove_pageDelete_errors {
  __typename: "PageError";
  code: PageErrorCode;
  field: string | null;
}

export interface PageRemove_pageDelete {
  __typename: "PageDelete";
  errors: PageRemove_pageDelete_errors[];
}

export interface PageRemove {
  pageDelete: PageRemove_pageDelete | null;
}

export interface PageRemoveVariables {
  id: string;
}
