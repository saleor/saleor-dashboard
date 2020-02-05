/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WarehouseErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AssignShippingZoneToWarehouse
// ====================================================

export interface AssignShippingZoneToWarehouse_assignWarehouseShippingZone_warehouseErrors {
  __typename: "WarehouseError";
  code: WarehouseErrorCode | null;
  field: string | null;
}

export interface AssignShippingZoneToWarehouse_assignWarehouseShippingZone {
  __typename: "WarehouseShippingZoneAssign";
  warehouseErrors: AssignShippingZoneToWarehouse_assignWarehouseShippingZone_warehouseErrors[] | null;
}

export interface AssignShippingZoneToWarehouse {
  assignWarehouseShippingZone: AssignShippingZoneToWarehouse_assignWarehouseShippingZone | null;
}

export interface AssignShippingZoneToWarehouseVariables {
  warehouseId: string;
  shippingZoneId: string;
}
