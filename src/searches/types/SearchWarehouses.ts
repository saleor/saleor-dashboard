/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchWarehouses
// ====================================================

export interface SearchWarehouses_search_edges_node {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface SearchWarehouses_search_edges {
  __typename: "WarehouseCountableEdge";
  node: SearchWarehouses_search_edges_node;
}

export interface SearchWarehouses_search_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchWarehouses_search {
  __typename: "WarehouseCountableConnection";
  edges: SearchWarehouses_search_edges[];
  pageInfo: SearchWarehouses_search_pageInfo;
}

export interface SearchWarehouses {
  search: SearchWarehouses_search | null;
}

export interface SearchWarehousesVariables {
  after?: string | null;
  first: number;
  query: string;
}
