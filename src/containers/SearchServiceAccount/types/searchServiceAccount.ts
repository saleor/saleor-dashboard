/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchServiceAccount
// ====================================================

export interface SearchServiceAccount_serviceAccounts_edges_node {
  __typename: "ServiceAccount";
  id: string;
  name: string | null;
}

export interface SearchServiceAccount_serviceAccounts_edges {
  __typename: "ServiceAccountCountableEdge";
  node: SearchServiceAccount_serviceAccounts_edges_node;
}

export interface SearchServiceAccount_serviceAccounts {
  __typename: "ServiceAccountCountableConnection";
  edges: SearchServiceAccount_serviceAccounts_edges[];
}

export interface SearchServiceAccount {
  serviceAccounts: SearchServiceAccount_serviceAccounts | null;
}

export interface SearchServiceAccountVariables {
  after?: string | null;
  first: number;
  query: string;
}
