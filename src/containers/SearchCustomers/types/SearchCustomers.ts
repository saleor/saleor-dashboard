/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchCustomers
// ====================================================

export interface SearchCustomers_search_edges_node {
  __typename: "User";
  id: string;
  email: string;
}

export interface SearchCustomers_search_edges {
  __typename: "UserCountableEdge";
  node: SearchCustomers_search_edges_node;
}

export interface SearchCustomers_search_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchCustomers_search {
  __typename: "UserCountableConnection";
  edges: SearchCustomers_search_edges[];
  pageInfo: SearchCustomers_search_pageInfo;
}

export interface SearchCustomers {
  search: SearchCustomers_search | null;
}

export interface SearchCustomersVariables {
  after?: string | null;
  first: number;
  query: string;
}
