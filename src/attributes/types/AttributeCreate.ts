/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeCreateInput, AttributeTypeEnum, MeasurementUnitsEnum, AttributeInputTypeEnum, AttributeEntityTypeEnum, AttributeErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AttributeCreate
// ====================================================

export interface AttributeCreate_attributeCreate_attribute_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AttributeCreate_attributeCreate_attribute_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AttributeCreate_attributeCreate_attribute_values_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface AttributeCreate_attributeCreate_attribute_values_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface AttributeCreate_attributeCreate_attribute_values_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: AttributeCreate_attributeCreate_attribute_values_edges_node_file | null;
  reference: string | null;
  richText: any | null;
}

export interface AttributeCreate_attributeCreate_attribute_values_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: AttributeCreate_attributeCreate_attribute_values_edges_node;
}

export interface AttributeCreate_attributeCreate_attribute_values {
  __typename: "AttributeValueCountableConnection";
  pageInfo: AttributeCreate_attributeCreate_attribute_values_pageInfo;
  edges: AttributeCreate_attributeCreate_attribute_values_edges[];
}

export interface AttributeCreate_attributeCreate_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeTypeEnum | null;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
  unit: MeasurementUnitsEnum | null;
  metadata: (AttributeCreate_attributeCreate_attribute_metadata | null)[];
  privateMetadata: (AttributeCreate_attributeCreate_attribute_privateMetadata | null)[];
  availableInGrid: boolean;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  storefrontSearchPosition: number;
  valueRequired: boolean;
  values: AttributeCreate_attributeCreate_attribute_values | null;
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
  firstValues?: number | null;
  afterValues?: string | null;
  lastValues?: number | null;
  beforeValues?: string | null;
}
