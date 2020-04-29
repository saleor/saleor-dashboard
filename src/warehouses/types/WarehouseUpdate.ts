/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WarehouseUpdateInput, WarehouseErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: WarehouseUpdate
// ====================================================

export interface WarehouseUpdate_updateWarehouse_errors {
  __typename: "WarehouseError";
  code: WarehouseErrorCode;
  field: string | null;
}

export interface WarehouseUpdate_updateWarehouse_warehouse_shippingZones_edges_node {
  __typename: "ShippingZone";
  id: string;
  name: string;
}

export interface WarehouseUpdate_updateWarehouse_warehouse_shippingZones_edges {
  __typename: "ShippingZoneCountableEdge";
  node: WarehouseUpdate_updateWarehouse_warehouse_shippingZones_edges_node;
}

export interface WarehouseUpdate_updateWarehouse_warehouse_shippingZones {
  __typename: "ShippingZoneCountableConnection";
  edges: WarehouseUpdate_updateWarehouse_warehouse_shippingZones_edges[];
}

export interface WarehouseUpdate_updateWarehouse_warehouse_address_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface WarehouseUpdate_updateWarehouse_warehouse_address {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: WarehouseUpdate_updateWarehouse_warehouse_address_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface WarehouseUpdate_updateWarehouse_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
  shippingZones: WarehouseUpdate_updateWarehouse_warehouse_shippingZones;
  address: WarehouseUpdate_updateWarehouse_warehouse_address;
}

export interface WarehouseUpdate_updateWarehouse {
  __typename: "WarehouseUpdate";
  errors: WarehouseUpdate_updateWarehouse_errors[];
  warehouse: WarehouseUpdate_updateWarehouse_warehouse | null;
}

export interface WarehouseUpdate {
  updateWarehouse: WarehouseUpdate_updateWarehouse | null;
}

export interface WarehouseUpdateVariables {
  id: string;
  input: WarehouseUpdateInput;
}
