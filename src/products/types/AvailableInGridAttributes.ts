/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AvailableInGridAttributes
// ====================================================

export interface AvailableInGridAttributes_availableInGrid_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
}

export interface AvailableInGridAttributes_availableInGrid_edges {
  __typename: "AttributeCountableEdge";
  node: AvailableInGridAttributes_availableInGrid_edges_node;
}

export interface AvailableInGridAttributes_availableInGrid_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface AvailableInGridAttributes_availableInGrid {
  __typename: "AttributeCountableConnection";
  edges: AvailableInGridAttributes_availableInGrid_edges[];
  pageInfo: AvailableInGridAttributes_availableInGrid_pageInfo;
  totalCount: number | null;
}

export interface AvailableInGridAttributes {
  availableInGrid: AvailableInGridAttributes_availableInGrid | null;
}

export interface AvailableInGridAttributesVariables {
  first: number;
  after?: string | null;
}
