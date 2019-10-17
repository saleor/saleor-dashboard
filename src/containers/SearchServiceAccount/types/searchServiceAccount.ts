/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchServiceAccount
// ====================================================

export interface SearchServiceAccount_search_edges_node {
  __typename: "ServiceAccount";
  id: string;
  name: string | null;
}

export interface SearchServiceAccount_search_edges {
  __typename: "ServiceAccountCountableEdge";
  node: SearchServiceAccount_search_edges_node;
}

export interface SearchServiceAccount_search_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchServiceAccount_search {
  __typename: "ServiceAccountCountableConnection";
  edges: SearchServiceAccount_search_edges[];
  pageInfo: SearchServiceAccount_search_pageInfo;
}

export interface SearchServiceAccount {
  search: SearchServiceAccount_search | null;
}

export interface SearchServiceAccountVariables {
  after?: string | null;
  first: number;
  query: string;
}
