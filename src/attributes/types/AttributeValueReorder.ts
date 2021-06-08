/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReorderInput, AttributeErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AttributeValueReorder
// ====================================================

export interface AttributeValueReorder_attributeReorderValues_attribute_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface AttributeValueReorder_attributeReorderValues_attribute_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
}

export interface AttributeValueReorder_attributeReorderValues_attribute_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: AttributeValueReorder_attributeReorderValues_attribute_choices_edges_node;
}

export interface AttributeValueReorder_attributeReorderValues_attribute_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: AttributeValueReorder_attributeReorderValues_attribute_choices_pageInfo;
  edges: AttributeValueReorder_attributeReorderValues_attribute_choices_edges[];
}

export interface AttributeValueReorder_attributeReorderValues_attribute {
  __typename: "Attribute";
  id: string;
  choices: AttributeValueReorder_attributeReorderValues_attribute_choices | null;
}

export interface AttributeValueReorder_attributeReorderValues_errors {
  __typename: "AttributeError";
  code: AttributeErrorCode;
  field: string | null;
}

export interface AttributeValueReorder_attributeReorderValues {
  __typename: "AttributeReorderValues";
  attribute: AttributeValueReorder_attributeReorderValues_attribute | null;
  errors: AttributeValueReorder_attributeReorderValues_errors[];
}

export interface AttributeValueReorder {
  attributeReorderValues: AttributeValueReorder_attributeReorderValues | null;
}

export interface AttributeValueReorderVariables {
  id: string;
  move: ReorderInput;
  firstValues?: number | null;
  afterValues?: string | null;
  lastValues?: number | null;
  beforeValues?: string | null;
}
