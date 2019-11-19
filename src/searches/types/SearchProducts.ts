/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchProducts
// ====================================================

export interface SearchProducts_search_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SearchProducts_search_edges_node {
  __typename: "Product";
  id: string;
  name: string;
  thumbnail: SearchProducts_search_edges_node_thumbnail | null;
}

export interface SearchProducts_search_edges {
  __typename: "ProductCountableEdge";
  node: SearchProducts_search_edges_node;
}

export interface SearchProducts_search_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchProducts_search {
  __typename: "ProductCountableConnection";
  edges: SearchProducts_search_edges[];
  pageInfo: SearchProducts_search_pageInfo;
}

export interface SearchProducts {
  search: SearchProducts_search | null;
}

export interface SearchProductsVariables {
  after?: string | null;
  first: number;
  query: string;
}
