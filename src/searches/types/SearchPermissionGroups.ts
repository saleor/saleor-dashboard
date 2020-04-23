/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchPermissionGroups
// ====================================================

export interface SearchPermissionGroups_search_edges_node {
  __typename: "Group";
  id: string;
  name: string;
  userCanManage: boolean;
}

export interface SearchPermissionGroups_search_edges {
  __typename: "GroupCountableEdge";
  node: SearchPermissionGroups_search_edges_node;
}

export interface SearchPermissionGroups_search_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchPermissionGroups_search {
  __typename: "GroupCountableConnection";
  edges: SearchPermissionGroups_search_edges[];
  pageInfo: SearchPermissionGroups_search_pageInfo;
}

export interface SearchPermissionGroups {
  search: SearchPermissionGroups_search | null;
}

export interface SearchPermissionGroupsVariables {
  after?: string | null;
  first: number;
  query: string;
}
