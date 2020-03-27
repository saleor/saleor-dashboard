/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WarehouseErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: WarehouseDelete
// ====================================================

export interface WarehouseDelete_deleteWarehouse_errors {
  __typename: "WarehouseError";
  code: WarehouseErrorCode;
  field: string | null;
}

export interface WarehouseDelete_deleteWarehouse {
  __typename: "WarehouseDelete";
  errors: WarehouseDelete_deleteWarehouse_errors[];
}

export interface WarehouseDelete {
  deleteWarehouse: WarehouseDelete_deleteWarehouse | null;
}

export interface WarehouseDeleteVariables {
  id: string;
}
