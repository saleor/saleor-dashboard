/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeValueCreateInput, AttributeTypeEnum, AttributeInputTypeEnum, AttributeEntityTypeEnum, AttributeErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AttributeValueCreate
// ====================================================

export interface AttributeValueCreate_attributeValueCreate_attribute_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AttributeValueCreate_attributeValueCreate_attribute_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AttributeValueCreate_attributeValueCreate_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface AttributeValueCreate_attributeValueCreate_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: AttributeValueCreate_attributeValueCreate_attribute_values_file | null;
  reference: string | null;
}

export interface AttributeValueCreate_attributeValueCreate_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeTypeEnum | null;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
  metadata: (AttributeValueCreate_attributeValueCreate_attribute_metadata | null)[];
  privateMetadata: (AttributeValueCreate_attributeValueCreate_attribute_privateMetadata | null)[];
  availableInGrid: boolean;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  storefrontSearchPosition: number;
  valueRequired: boolean;
  values: (AttributeValueCreate_attributeValueCreate_attribute_values | null)[] | null;
}

export interface AttributeValueCreate_attributeValueCreate_errors {
  __typename: "AttributeError";
  code: AttributeErrorCode;
  field: string | null;
}

export interface AttributeValueCreate_attributeValueCreate {
  __typename: "AttributeValueCreate";
  attribute: AttributeValueCreate_attributeValueCreate_attribute | null;
  errors: AttributeValueCreate_attributeValueCreate_errors[];
}

export interface AttributeValueCreate {
  attributeValueCreate: AttributeValueCreate_attributeValueCreate | null;
}

export interface AttributeValueCreateVariables {
  id: string;
  input: AttributeValueCreateInput;
}
