/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: InitialProductFilterAttributes
// ====================================================

export interface InitialProductFilterAttributes_attributes_edges_node_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface InitialProductFilterAttributes_attributes_edges_node_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface InitialProductFilterAttributes_attributes_edges_node_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: InitialProductFilterAttributes_attributes_edges_node_choices_edges_node;
}

export interface InitialProductFilterAttributes_attributes_edges_node_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: InitialProductFilterAttributes_attributes_edges_node_choices_pageInfo;
  edges: InitialProductFilterAttributes_attributes_edges_node_choices_edges[];
}

export interface InitialProductFilterAttributes_attributes_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  choices: InitialProductFilterAttributes_attributes_edges_node_choices | null;
}

export interface InitialProductFilterAttributes_attributes_edges {
  __typename: "AttributeCountableEdge";
  node: InitialProductFilterAttributes_attributes_edges_node;
}

export interface InitialProductFilterAttributes_attributes {
  __typename: "AttributeCountableConnection";
  edges: InitialProductFilterAttributes_attributes_edges[];
}

export interface InitialProductFilterAttributes {
  attributes: InitialProductFilterAttributes_attributes | null;
}

export interface InitialProductFilterAttributesVariables {
  firstValues?: number | null;
  afterValues?: string | null;
  lastValues?: number | null;
  beforeValues?: string | null;
}
