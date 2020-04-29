/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WarehouseCreateInput, WarehouseErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: WarehouseCreate
// ====================================================

export interface WarehouseCreate_createWarehouse_errors {
  __typename: "WarehouseError";
  code: WarehouseErrorCode;
  field: string | null;
}

export interface WarehouseCreate_createWarehouse_warehouse_shippingZones_edges_node {
  __typename: "ShippingZone";
  id: string;
  name: string;
}

export interface WarehouseCreate_createWarehouse_warehouse_shippingZones_edges {
  __typename: "ShippingZoneCountableEdge";
  node: WarehouseCreate_createWarehouse_warehouse_shippingZones_edges_node;
}

export interface WarehouseCreate_createWarehouse_warehouse_shippingZones {
  __typename: "ShippingZoneCountableConnection";
  edges: WarehouseCreate_createWarehouse_warehouse_shippingZones_edges[];
}

export interface WarehouseCreate_createWarehouse_warehouse_address_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface WarehouseCreate_createWarehouse_warehouse_address {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: WarehouseCreate_createWarehouse_warehouse_address_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface WarehouseCreate_createWarehouse_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
  shippingZones: WarehouseCreate_createWarehouse_warehouse_shippingZones;
  address: WarehouseCreate_createWarehouse_warehouse_address;
}

export interface WarehouseCreate_createWarehouse {
  __typename: "WarehouseCreate";
  errors: WarehouseCreate_createWarehouse_errors[];
  warehouse: WarehouseCreate_createWarehouse_warehouse | null;
}

export interface WarehouseCreate {
  createWarehouse: WarehouseCreate_createWarehouse | null;
}

export interface WarehouseCreateVariables {
  input: WarehouseCreateInput;
}
