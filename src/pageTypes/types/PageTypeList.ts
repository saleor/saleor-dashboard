/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PageTypeFilterInput, PageTypeSortingInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: PageTypeList
// ====================================================

export interface PageTypeList_pageTypes_edges_node {
  __typename: "PageType";
  id: string;
  name: string;
  hasPages: boolean | null;
}

export interface PageTypeList_pageTypes_edges {
  __typename: "PageTypeCountableEdge";
  node: PageTypeList_pageTypes_edges_node;
}

export interface PageTypeList_pageTypes_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface PageTypeList_pageTypes {
  __typename: "PageTypeCountableConnection";
  edges: PageTypeList_pageTypes_edges[];
  pageInfo: PageTypeList_pageTypes_pageInfo;
}

export interface PageTypeList {
  pageTypes: PageTypeList_pageTypes | null;
}

export interface PageTypeListVariables {
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
  filter?: PageTypeFilterInput | null;
  sort?: PageTypeSortingInput | null;
}
