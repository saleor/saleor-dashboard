/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeUpdateInput, AttributeInputTypeEnum, AttributeValueType, ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AttributeUpdate
// ====================================================

export interface AttributeUpdate_attributeUpdate_attribute_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AttributeUpdate_attributeUpdate_attribute_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AttributeUpdate_attributeUpdate_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeValueType | null;
}

export interface AttributeUpdate_attributeUpdate_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
  metadata: (AttributeUpdate_attributeUpdate_attribute_metadata | null)[];
  privateMetadata: (AttributeUpdate_attributeUpdate_attribute_privateMetadata | null)[];
  availableInGrid: boolean;
  inputType: AttributeInputTypeEnum | null;
  storefrontSearchPosition: number;
  values: (AttributeUpdate_attributeUpdate_attribute_values | null)[] | null;
}

export interface AttributeUpdate_attributeUpdate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface AttributeUpdate_attributeUpdate {
  __typename: "AttributeUpdate";
  attribute: AttributeUpdate_attributeUpdate_attribute | null;
  errors: AttributeUpdate_attributeUpdate_errors[];
}

export interface AttributeUpdate {
  attributeUpdate: AttributeUpdate_attributeUpdate | null;
}

export interface AttributeUpdateVariables {
  id: string;
  input: AttributeUpdateInput;
}
