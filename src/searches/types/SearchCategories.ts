/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchCategories
// ====================================================

export interface SearchCategories_search_edges_node {
  __typename: "Category";
  id: string;
  name: string;
}

export interface SearchCategories_search_edges {
  __typename: "CategoryCountableEdge";
  node: SearchCategories_search_edges_node;
}

export interface SearchCategories_search_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchCategories_search {
  __typename: "CategoryCountableConnection";
  edges: SearchCategories_search_edges[];
  pageInfo: SearchCategories_search_pageInfo;
}

export interface SearchCategories {
  search: SearchCategories_search | null;
}

export interface SearchCategoriesVariables {
  after?: string | null;
  first: number;
  query: string;
}
