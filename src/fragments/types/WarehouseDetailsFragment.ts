/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: WarehouseDetailsFragment
// ====================================================

export interface WarehouseDetailsFragment_shippingZones_edges_node {
  __typename: "ShippingZone";
  id: string;
  name: string;
}

export interface WarehouseDetailsFragment_shippingZones_edges {
  __typename: "ShippingZoneCountableEdge";
  node: WarehouseDetailsFragment_shippingZones_edges_node;
}

export interface WarehouseDetailsFragment_shippingZones {
  __typename: "ShippingZoneCountableConnection";
  edges: WarehouseDetailsFragment_shippingZones_edges[];
}

export interface WarehouseDetailsFragment_address_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface WarehouseDetailsFragment_address {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: WarehouseDetailsFragment_address_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface WarehouseDetailsFragment {
  __typename: "Warehouse";
  id: string;
  name: string;
  shippingZones: WarehouseDetailsFragment_shippingZones;
  address: WarehouseDetailsFragment_address;
}
