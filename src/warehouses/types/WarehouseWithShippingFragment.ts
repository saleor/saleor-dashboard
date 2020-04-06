/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: WarehouseWithShippingFragment
// ====================================================

export interface WarehouseWithShippingFragment_shippingZones_edges_node {
  __typename: "ShippingZone";
  id: string;
  name: string;
}

export interface WarehouseWithShippingFragment_shippingZones_edges {
  __typename: "ShippingZoneCountableEdge";
  node: WarehouseWithShippingFragment_shippingZones_edges_node;
}

export interface WarehouseWithShippingFragment_shippingZones {
  __typename: "ShippingZoneCountableConnection";
  edges: WarehouseWithShippingFragment_shippingZones_edges[];
}

export interface WarehouseWithShippingFragment {
  __typename: "Warehouse";
  id: string;
  name: string;
  shippingZones: WarehouseWithShippingFragment_shippingZones;
}
