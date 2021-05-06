/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: InitialProductFilterCollections
// ====================================================

export interface InitialProductFilterCollections_collections_edges_node {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface InitialProductFilterCollections_collections_edges {
  __typename: "CollectionCountableEdge";
  node: InitialProductFilterCollections_collections_edges_node;
}

export interface InitialProductFilterCollections_collections {
  __typename: "CollectionCountableConnection";
  edges: InitialProductFilterCollections_collections_edges[];
}

export interface InitialProductFilterCollections {
  collections: InitialProductFilterCollections_collections | null;
}

export interface InitialProductFilterCollectionsVariables {
  collections?: string[] | null;
}
