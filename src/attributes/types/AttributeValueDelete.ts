/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AttributeValueDelete
// ====================================================

export interface AttributeValueDelete_attributeValueDelete_attribute_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface AttributeValueDelete_attributeValueDelete_attribute_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface AttributeValueDelete_attributeValueDelete_attribute_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: AttributeValueDelete_attributeValueDelete_attribute_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface AttributeValueDelete_attributeValueDelete_attribute_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: AttributeValueDelete_attributeValueDelete_attribute_choices_edges_node;
}

export interface AttributeValueDelete_attributeValueDelete_attribute_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: AttributeValueDelete_attributeValueDelete_attribute_choices_pageInfo;
  edges: AttributeValueDelete_attributeValueDelete_attribute_choices_edges[];
}

export interface AttributeValueDelete_attributeValueDelete_attribute {
  __typename: "Attribute";
  id: string;
  choices: AttributeValueDelete_attributeValueDelete_attribute_choices | null;
}

export interface AttributeValueDelete_attributeValueDelete_errors {
  __typename: "AttributeError";
  code: AttributeErrorCode;
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
  firstValues?: number | null;
  afterValues?: string | null;
  lastValues?: number | null;
  beforeValues?: string | null;
}
