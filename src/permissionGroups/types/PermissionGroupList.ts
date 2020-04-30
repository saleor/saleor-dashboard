/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PermissionGroupFilterInput, PermissionGroupSortingInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: PermissionGroupList
// ====================================================

export interface PermissionGroupList_permissionGroups_edges_node_users {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface PermissionGroupList_permissionGroups_edges_node {
  __typename: "Group";
  id: string;
  name: string;
  userCanManage: boolean;
  users: (PermissionGroupList_permissionGroups_edges_node_users | null)[] | null;
}

export interface PermissionGroupList_permissionGroups_edges {
  __typename: "GroupCountableEdge";
  node: PermissionGroupList_permissionGroups_edges_node;
}

export interface PermissionGroupList_permissionGroups_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface PermissionGroupList_permissionGroups {
  __typename: "GroupCountableConnection";
  edges: PermissionGroupList_permissionGroups_edges[];
  pageInfo: PermissionGroupList_permissionGroups_pageInfo;
}

export interface PermissionGroupList {
  permissionGroups: PermissionGroupList_permissionGroups | null;
}

export interface PermissionGroupListVariables {
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
  filter?: PermissionGroupFilterInput | null;
  sort?: PermissionGroupSortingInput | null;
}
