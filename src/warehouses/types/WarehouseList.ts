/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WarehouseFilterInput, WarehouseSortingInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: WarehouseList
// ====================================================

export interface WarehouseList_warehouses_edges_node_shippingZones_edges_node {
  __typename: "ShippingZone";
  id: string;
  name: string;
}

export interface WarehouseList_warehouses_edges_node_shippingZones_edges {
  __typename: "ShippingZoneCountableEdge";
  node: WarehouseList_warehouses_edges_node_shippingZones_edges_node;
}

export interface WarehouseList_warehouses_edges_node_shippingZones {
  __typename: "ShippingZoneCountableConnection";
  edges: WarehouseList_warehouses_edges_node_shippingZones_edges[];
}

export interface WarehouseList_warehouses_edges_node {
  __typename: "Warehouse";
  id: string;
  name: string;
  shippingZones: WarehouseList_warehouses_edges_node_shippingZones;
}

export interface WarehouseList_warehouses_edges {
  __typename: "WarehouseCountableEdge";
  node: WarehouseList_warehouses_edges_node;
}

export interface WarehouseList_warehouses_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface WarehouseList_warehouses {
  __typename: "WarehouseCountableConnection";
  edges: WarehouseList_warehouses_edges[];
  pageInfo: WarehouseList_warehouses_pageInfo;
}

export interface WarehouseList {
  warehouses: WarehouseList_warehouses | null;
}

export interface WarehouseListVariables {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
  filter?: WarehouseFilterInput | null;
  sort?: WarehouseSortingInput | null;
}
