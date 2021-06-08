/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchPageTypes
// ====================================================

export interface SearchPageTypes_search_edges_node {
  __typename: "PageType";
  id: string;
  name: string;
}

export interface SearchPageTypes_search_edges {
  __typename: "PageTypeCountableEdge";
  node: SearchPageTypes_search_edges_node;
}

export interface SearchPageTypes_search_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchPageTypes_search {
  __typename: "PageTypeCountableConnection";
  edges: SearchPageTypes_search_edges[];
  pageInfo: SearchPageTypes_search_pageInfo;
}

export interface SearchPageTypes {
  search: SearchPageTypes_search | null;
}

export interface SearchPageTypesVariables {
  after?: string | null;
  first: number;
  query: string;
}
