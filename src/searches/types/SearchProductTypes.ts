/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchProductTypes
// ====================================================

export interface SearchProductTypes_search_edges_node {
  __typename: "ProductType";
  id: string;
  name: string;
}

export interface SearchProductTypes_search_edges {
  __typename: "ProductTypeCountableEdge";
  node: SearchProductTypes_search_edges_node;
}

export interface SearchProductTypes_search_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchProductTypes_search {
  __typename: "ProductTypeCountableConnection";
  edges: SearchProductTypes_search_edges[];
  pageInfo: SearchProductTypes_search_pageInfo;
}

export interface SearchProductTypes {
  search: SearchProductTypes_search | null;
}

export interface SearchProductTypesVariables {
  after?: string | null;
  first: number;
  query: string;
}
