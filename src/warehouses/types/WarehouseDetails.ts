/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: WarehouseDetails
// ====================================================

export interface WarehouseDetails_warehouse_shippingZones_edges_node {
  __typename: "ShippingZone";
  id: string;
  name: string;
}

export interface WarehouseDetails_warehouse_shippingZones_edges {
  __typename: "ShippingZoneCountableEdge";
  node: WarehouseDetails_warehouse_shippingZones_edges_node;
}

export interface WarehouseDetails_warehouse_shippingZones {
  __typename: "ShippingZoneCountableConnection";
  edges: WarehouseDetails_warehouse_shippingZones_edges[];
}

export interface WarehouseDetails_warehouse_address_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface WarehouseDetails_warehouse_address {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: WarehouseDetails_warehouse_address_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface WarehouseDetails_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
  shippingZones: WarehouseDetails_warehouse_shippingZones;
  address: WarehouseDetails_warehouse_address;
}

export interface WarehouseDetails {
  warehouse: WarehouseDetails_warehouse | null;
}

export interface WarehouseDetailsVariables {
  id: string;
}
