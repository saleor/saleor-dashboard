/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AvailableInGridAttributes
// ====================================================

export interface AvailableInGridAttributes_attributes_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
}

export interface AvailableInGridAttributes_attributes_edges {
  __typename: "AttributeCountableEdge";
  node: AvailableInGridAttributes_attributes_edges_node;
}

export interface AvailableInGridAttributes_attributes_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface AvailableInGridAttributes_attributes {
  __typename: "AttributeCountableConnection";
  edges: AvailableInGridAttributes_attributes_edges[];
  pageInfo: AvailableInGridAttributes_attributes_pageInfo;
  totalCount: number | null;
}

export interface AvailableInGridAttributes {
  attributes: AvailableInGridAttributes_attributes | null;
}

export interface AvailableInGridAttributesVariables {
  first: number;
  after?: string | null;
}
