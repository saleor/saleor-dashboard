/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AttributeBulkDelete
// ====================================================

export interface AttributeBulkDelete_attributeBulkDelete_errors {
  __typename: "AttributeError";
  code: AttributeErrorCode;
  field: string | null;
}

export interface AttributeBulkDelete_attributeBulkDelete {
  __typename: "AttributeBulkDelete";
  errors: AttributeBulkDelete_attributeBulkDelete_errors[];
}

export interface AttributeBulkDelete {
  attributeBulkDelete: AttributeBulkDelete_attributeBulkDelete | null;
}

export interface AttributeBulkDeleteVariables {
  ids: string[];
}
