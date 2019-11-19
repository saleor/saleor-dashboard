/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchCollections
// ====================================================

export interface SearchCollections_search_edges_node {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface SearchCollections_search_edges {
  __typename: "CollectionCountableEdge";
  node: SearchCollections_search_edges_node;
}

export interface SearchCollections_search_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchCollections_search {
  __typename: "CollectionCountableConnection";
  edges: SearchCollections_search_edges[];
  pageInfo: SearchCollections_search_pageInfo;
}

export interface SearchCollections {
  search: SearchCollections_search | null;
}

export interface SearchCollectionsVariables {
  after?: string | null;
  first: number;
  query: string;
}
