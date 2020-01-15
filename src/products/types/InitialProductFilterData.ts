/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: InitialProductFilterData
// ====================================================

export interface InitialProductFilterData_categories_edges_node {
  __typename: "Category";
  id: string;
  name: string;
}

export interface InitialProductFilterData_categories_edges {
  __typename: "CategoryCountableEdge";
  node: InitialProductFilterData_categories_edges_node;
}

export interface InitialProductFilterData_categories {
  __typename: "CategoryCountableConnection";
  edges: InitialProductFilterData_categories_edges[];
}

export interface InitialProductFilterData_collections_edges_node {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface InitialProductFilterData_collections_edges {
  __typename: "CollectionCountableEdge";
  node: InitialProductFilterData_collections_edges_node;
}

export interface InitialProductFilterData_collections {
  __typename: "CollectionCountableConnection";
  edges: InitialProductFilterData_collections_edges[];
}

export interface InitialProductFilterData {
  categories: InitialProductFilterData_categories | null;
  collections: InitialProductFilterData_collections | null;
}

export interface InitialProductFilterDataVariables {
  categories?: string[] | null;
  collections?: string[] | null;
}
