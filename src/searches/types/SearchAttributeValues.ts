/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchAttributeValues
// ====================================================

export interface SearchAttributeValues_attribute_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface SearchAttributeValues_attribute_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: SearchAttributeValues_attribute_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface SearchAttributeValues_attribute_choices_edges {
  __typename: "AttributeValueCountableEdge";
  node: SearchAttributeValues_attribute_choices_edges_node;
}

export interface SearchAttributeValues_attribute_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchAttributeValues_attribute_choices {
  __typename: "AttributeValueCountableConnection";
  edges: SearchAttributeValues_attribute_choices_edges[];
  pageInfo: SearchAttributeValues_attribute_choices_pageInfo;
}

export interface SearchAttributeValues_attribute {
  __typename: "Attribute";
  id: string;
  choices: SearchAttributeValues_attribute_choices | null;
}

export interface SearchAttributeValues {
  attribute: SearchAttributeValues_attribute | null;
}

export interface SearchAttributeValuesVariables {
  id?: string | null;
  after?: string | null;
  first: number;
  query: string;
}
