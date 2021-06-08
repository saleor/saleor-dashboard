/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductBulkClearWarehouseLocation
// ====================================================

export interface ProductBulkClearWarehouseLocation_ProductBulkClearWarehouseLocation_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductBulkClearWarehouseLocation_ProductBulkClearWarehouseLocation {
  __typename: "ProductBulkClearWarehouseLocation";
  errors: ProductBulkClearWarehouseLocation_ProductBulkClearWarehouseLocation_errors[];
}

export interface ProductBulkClearWarehouseLocation {
  ProductBulkClearWarehouseLocation: ProductBulkClearWarehouseLocation_ProductBulkClearWarehouseLocation | null;
}

export interface ProductBulkClearWarehouseLocationVariables {
  skus: string[];
}
