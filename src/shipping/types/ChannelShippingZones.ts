/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ShippingZoneFilterInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ChannelShippingZones
// ====================================================

export interface ChannelShippingZones_shippingZones_edges_node {
  __typename: "ShippingZone";
  id: string;
  name: string;
}

export interface ChannelShippingZones_shippingZones_edges {
  __typename: "ShippingZoneCountableEdge";
  node: ChannelShippingZones_shippingZones_edges_node;
}

export interface ChannelShippingZones_shippingZones {
  __typename: "ShippingZoneCountableConnection";
  edges: ChannelShippingZones_shippingZones_edges[];
}

export interface ChannelShippingZones {
  shippingZones: ChannelShippingZones_shippingZones | null;
}

export interface ChannelShippingZonesVariables {
  filter?: ShippingZoneFilterInput | null;
}
