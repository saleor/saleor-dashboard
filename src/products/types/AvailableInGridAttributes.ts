/* tslint:disable */
/* eslint-disable */
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

export interface AvailableInGridAttributes_grid_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
}

export interface AvailableInGridAttributes_grid_edges {
  __typename: "AttributeCountableEdge";
  node: AvailableInGridAttributes_grid_edges_node;
}

export interface AvailableInGridAttributes_grid {
  __typename: "AttributeCountableConnection";
  edges: AvailableInGridAttributes_grid_edges[];
}

export interface AvailableInGridAttributes {
  availableInGrid: AvailableInGridAttributes_availableInGrid | null;
  grid: AvailableInGridAttributes_grid | null;
}

export interface AvailableInGridAttributesVariables {
  first: number;
  after?: string | null;
  ids: string[];
}
