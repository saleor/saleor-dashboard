/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PageErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: PageBulkRemove
// ====================================================

export interface PageBulkRemove_pageBulkDelete_errors {
  __typename: "PageError";
  code: PageErrorCode;
  field: string | null;
  message: string | null;
}

export interface PageBulkRemove_pageBulkDelete {
  __typename: "PageBulkDelete";
  errors: PageBulkRemove_pageBulkDelete_errors[];
}

export interface PageBulkRemove {
  pageBulkDelete: PageBulkRemove_pageBulkDelete | null;
}

export interface PageBulkRemoveVariables {
  ids: (string | null)[];
}
