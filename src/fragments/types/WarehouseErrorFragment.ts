/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { WarehouseErrorCode } from "@saleor/graphql";

// ====================================================
// GraphQL fragment: WarehouseErrorFragment
// ====================================================

export interface WarehouseErrorFragment {
  __typename: "WarehouseError";
  code: WarehouseErrorCode;
  field: string | null;
  message: string | null;
}
