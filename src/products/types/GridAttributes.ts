/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GridAttributes
// ====================================================

export interface GridAttributes_availableInGrid_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
}

export interface GridAttributes_availableInGrid_edges {
  __typename: "AttributeCountableEdge";
  node: GridAttributes_availableInGrid_edges_node;
}

export interface GridAttributes_availableInGrid_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface GridAttributes_availableInGrid {
  __typename: "AttributeCountableConnection";
  edges: GridAttributes_availableInGrid_edges[];
  pageInfo: GridAttributes_availableInGrid_pageInfo;
  totalCount: number | null;
}

export interface GridAttributes_grid_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
}

export interface GridAttributes_grid_edges {
  __typename: "AttributeCountableEdge";
  node: GridAttributes_grid_edges_node;
}

export interface GridAttributes_grid {
  __typename: "AttributeCountableConnection";
  edges: GridAttributes_grid_edges[];
}

export interface GridAttributes {
  availableInGrid: GridAttributes_availableInGrid | null;
  grid: GridAttributes_grid | null;
}

export interface GridAttributesVariables {
  first: number;
  after?: string | null;
  ids: string[];
}
