/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WarehouseErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AssignShippingZoneToWarehouse
// ====================================================

export interface AssignShippingZoneToWarehouse_assignWarehouseShippingZone_errors {
  __typename: "WarehouseError";
  code: WarehouseErrorCode;
  field: string | null;
}

export interface AssignShippingZoneToWarehouse_assignWarehouseShippingZone {
  __typename: "WarehouseShippingZoneAssign";
  errors: AssignShippingZoneToWarehouse_assignWarehouseShippingZone_errors[];
}

export interface AssignShippingZoneToWarehouse {
  assignWarehouseShippingZone: AssignShippingZoneToWarehouse_assignWarehouseShippingZone | null;
}

export interface AssignShippingZoneToWarehouseVariables {
  warehouseId: string;
  shippingZoneId: string;
}
