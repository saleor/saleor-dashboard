/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeValueCreateInput, AttributeErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AttributeValueCreate
// ====================================================

export interface AttributeValueCreate_attributeValueCreate_attribute_values_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface AttributeValueCreate_attributeValueCreate_attribute_values_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface AttributeValueCreate_attributeValueCreate_attribute_values_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: AttributeValueCreate_attributeValueCreate_attribute_values_edges_node_file | null;
  reference: string | null;
  richText: any | null;
}

export interface AttributeValueCreate_attributeValueCreate_attribute_values_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: AttributeValueCreate_attributeValueCreate_attribute_values_edges_node;
}

export interface AttributeValueCreate_attributeValueCreate_attribute_values {
  __typename: "AttributeValueCountableConnection";
  pageInfo: AttributeValueCreate_attributeValueCreate_attribute_values_pageInfo;
  edges: AttributeValueCreate_attributeValueCreate_attribute_values_edges[];
}

export interface AttributeValueCreate_attributeValueCreate_attribute {
  __typename: "Attribute";
  id: string;
  values: AttributeValueCreate_attributeValueCreate_attribute_values | null;
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
  firstValues?: number | null;
  afterValues?: string | null;
  lastValues?: number | null;
  beforeValues?: string | null;
}
