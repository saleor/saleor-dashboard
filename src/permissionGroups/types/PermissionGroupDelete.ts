/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PermissionGroupErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: PermissionGroupDelete
// ====================================================

export interface PermissionGroupDelete_permissionGroupDelete_errors {
  __typename: "PermissionGroupError";
  code: PermissionGroupErrorCode;
  field: string | null;
}

export interface PermissionGroupDelete_permissionGroupDelete {
  __typename: "PermissionGroupDelete";
  errors: PermissionGroupDelete_permissionGroupDelete_errors[];
}

export interface PermissionGroupDelete {
  permissionGroupDelete: PermissionGroupDelete_permissionGroupDelete | null;
}

export interface PermissionGroupDeleteVariables {
  id: string;
}
