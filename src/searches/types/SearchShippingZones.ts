/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchShippingZones
// ====================================================

export interface SearchShippingZones_search_edges_node_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface SearchShippingZones_search_edges_node_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface SearchShippingZones_search_edges_node_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface SearchShippingZones_search_edges_node {
  __typename: "ShippingZone";
  metadata: (SearchShippingZones_search_edges_node_metadata | null)[];
  privateMetadata: (SearchShippingZones_search_edges_node_privateMetadata | null)[];
  id: string;
  countries: (SearchShippingZones_search_edges_node_countries | null)[] | null;
  name: string;
  description: string | null;
}

export interface SearchShippingZones_search_edges {
  __typename: "ShippingZoneCountableEdge";
  node: SearchShippingZones_search_edges_node;
}

export interface SearchShippingZones_search_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchShippingZones_search {
  __typename: "ShippingZoneCountableConnection";
  edges: SearchShippingZones_search_edges[];
  pageInfo: SearchShippingZones_search_pageInfo;
}

export interface SearchShippingZones {
  search: SearchShippingZones_search | null;
}

export interface SearchShippingZonesVariables {
  query: string;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
