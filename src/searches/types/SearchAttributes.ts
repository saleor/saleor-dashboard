/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchAttributes
// ====================================================

export interface SearchAttributes_search_edges_node {
  __typename: "Attribute";
  id: string;
  name: string | null;
}

export interface SearchAttributes_search_edges {
  __typename: "AttributeCountableEdge";
  node: SearchAttributes_search_edges_node;
}

export interface SearchAttributes_search_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchAttributes_search {
  __typename: "AttributeCountableConnection";
  edges: SearchAttributes_search_edges[];
  pageInfo: SearchAttributes_search_pageInfo;
}

export interface SearchAttributes {
  search: SearchAttributes_search | null;
}

export interface SearchAttributesVariables {
  after?: string | null;
  first: number;
  query: string;
}
