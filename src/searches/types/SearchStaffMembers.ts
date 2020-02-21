/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchStaffMembers
// ====================================================

export interface SearchStaffMembers_search_edges_node_avatar {
  __typename: "Image";
  alt: string | null;
  url: string;
}

export interface SearchStaffMembers_search_edges_node {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  avatar: SearchStaffMembers_search_edges_node_avatar | null;
}

export interface SearchStaffMembers_search_edges {
  __typename: "UserCountableEdge";
  node: SearchStaffMembers_search_edges_node;
}

export interface SearchStaffMembers_search_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchStaffMembers_search {
  __typename: "UserCountableConnection";
  edges: SearchStaffMembers_search_edges[];
  pageInfo: SearchStaffMembers_search_pageInfo;
}

export interface SearchStaffMembers {
  search: SearchStaffMembers_search | null;
}

export interface SearchStaffMembersVariables {
  after?: string | null;
  first: number;
  query: string;
}
