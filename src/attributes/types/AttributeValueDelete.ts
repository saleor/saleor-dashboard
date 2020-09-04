/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum, AttributeValueType, ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AttributeValueDelete
// ====================================================

export interface AttributeValueDelete_attributeValueDelete_attribute_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AttributeValueDelete_attributeValueDelete_attribute_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AttributeValueDelete_attributeValueDelete_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeValueType | null;
}

export interface AttributeValueDelete_attributeValueDelete_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
  metadata: (AttributeValueDelete_attributeValueDelete_attribute_metadata | null)[];
  privateMetadata: (AttributeValueDelete_attributeValueDelete_attribute_privateMetadata | null)[];
  availableInGrid: boolean;
  inputType: AttributeInputTypeEnum | null;
  storefrontSearchPosition: number;
  values: (AttributeValueDelete_attributeValueDelete_attribute_values | null)[] | null;
}

export interface AttributeValueDelete_attributeValueDelete_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface AttributeValueDelete_attributeValueDelete {
  __typename: "AttributeValueDelete";
  attribute: AttributeValueDelete_attributeValueDelete_attribute | null;
  errors: AttributeValueDelete_attributeValueDelete_errors[];
}

export interface AttributeValueDelete {
  attributeValueDelete: AttributeValueDelete_attributeValueDelete | null;
}

export interface AttributeValueDeleteVariables {
  id: string;
}
