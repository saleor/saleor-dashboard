/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GridAttributes
// ====================================================

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
  grid: GridAttributes_grid | null;
}

export interface GridAttributesVariables {
  ids: string[];
}
