/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AttributeDelete
// ====================================================

export interface AttributeDelete_attributeDelete_errors {
  __typename: "AttributeError";
  code: AttributeErrorCode;
  field: string | null;
}

export interface AttributeDelete_attributeDelete {
  __typename: "AttributeDelete";
  errors: AttributeDelete_attributeDelete_errors[];
}

export interface AttributeDelete {
  attributeDelete: AttributeDelete_attributeDelete | null;
}

export interface AttributeDeleteVariables {
  id: string;
}
