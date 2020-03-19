/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WarehouseErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: UnassignShippingZoneToWarehouse
// ====================================================

export interface UnassignShippingZoneToWarehouse_unassignWarehouseShippingZone_warehouseErrors {
  __typename: "WarehouseError";
  code: WarehouseErrorCode;
  field: string | null;
}

export interface UnassignShippingZoneToWarehouse_unassignWarehouseShippingZone {
  __typename: "WarehouseShippingZoneUnassign";
  warehouseErrors: UnassignShippingZoneToWarehouse_unassignWarehouseShippingZone_warehouseErrors[];
}

export interface UnassignShippingZoneToWarehouse {
  unassignWarehouseShippingZone: UnassignShippingZoneToWarehouse_unassignWarehouseShippingZone | null;
}

export interface UnassignShippingZoneToWarehouseVariables {
  warehouseId: string;
  shippingZoneId: string;
}
