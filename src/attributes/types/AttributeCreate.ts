/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeCreateInput, AttributeErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AttributeCreate
// ====================================================

export interface AttributeCreate_attributeCreate_attribute {
  __typename: "Attribute";
  id: string;
}

export interface AttributeCreate_attributeCreate_errors {
  __typename: "AttributeError";
  code: AttributeErrorCode;
  field: string | null;
}

export interface AttributeCreate_attributeCreate {
  __typename: "AttributeCreate";
  attribute: AttributeCreate_attributeCreate_attribute | null;
  errors: AttributeCreate_attributeCreate_errors[];
}

export interface AttributeCreate {
  attributeCreate: AttributeCreate_attributeCreate | null;
}

export interface AttributeCreateVariables {
  input: AttributeCreateInput;
}
