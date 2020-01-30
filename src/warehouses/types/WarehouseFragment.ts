/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: WarehouseFragment
// ====================================================

export interface WarehouseFragment_shippingZones_edges_node {
  __typename: "ShippingZone";
  id: string;
  name: string;
}

export interface WarehouseFragment_shippingZones_edges {
  __typename: "ShippingZoneCountableEdge";
  node: WarehouseFragment_shippingZones_edges_node;
}

export interface WarehouseFragment_shippingZones {
  __typename: "ShippingZoneCountableConnection";
  edges: WarehouseFragment_shippingZones_edges[];
}

export interface WarehouseFragment {
  __typename: "Warehouse";
  id: string;
  name: string;
  shippingZones: WarehouseFragment_shippingZones;
}
