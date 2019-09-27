/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ServiceAccountFilterInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ServiceList
// ====================================================

export interface ServiceList_serviceAccounts_edges_node {
  __typename: "ServiceAccount";
  id: string;
  name: string | null;
  isActive: boolean | null;
}

export interface ServiceList_serviceAccounts_edges {
  __typename: "ServiceAccountCountableEdge";
  node: ServiceList_serviceAccounts_edges_node;
}

export interface ServiceList_serviceAccounts_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface ServiceList_serviceAccounts {
  __typename: "ServiceAccountCountableConnection";
  edges: ServiceList_serviceAccounts_edges[];
  pageInfo: ServiceList_serviceAccounts_pageInfo;
}

export interface ServiceList {
  serviceAccounts: ServiceList_serviceAccounts | null;
}

export interface ServiceListVariables {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
  filter?: ServiceAccountFilterInput | null;
}
