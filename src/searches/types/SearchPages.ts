/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchPages
// ====================================================

export interface SearchPages_search_edges_node {
  __typename: "Page";
  id: string;
  title: string;
}

export interface SearchPages_search_edges {
  __typename: "PageCountableEdge";
  node: SearchPages_search_edges_node;
}

export interface SearchPages_search_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchPages_search {
  __typename: "PageCountableConnection";
  edges: SearchPages_search_edges[];
  pageInfo: SearchPages_search_pageInfo;
}

export interface SearchPages {
  search: SearchPages_search | null;
}

export interface SearchPagesVariables {
  after?: string | null;
  first: number;
  query: string;
}
