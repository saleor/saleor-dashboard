/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: WarehouseDelete
// ====================================================

export interface WarehouseDelete_deleteWarehouse_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface WarehouseDelete_deleteWarehouse {
  __typename: "WarehouseDelete";
  errors: WarehouseDelete_deleteWarehouse_errors[] | null;
}

export interface WarehouseDelete {
  deleteWarehouse: WarehouseDelete_deleteWarehouse | null;
}

export interface WarehouseDeleteVariables {
  id: string;
}
