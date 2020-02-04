/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PermissionGroupDelete
// ====================================================

export interface PermissionGroupDelete_permissionGroupDelete_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface PermissionGroupDelete_permissionGroupDelete {
  __typename: "PermissionGroupDelete";
  errors: PermissionGroupDelete_permissionGroupDelete_errors[] | null;
}

export interface PermissionGroupDelete {
  permissionGroupDelete: PermissionGroupDelete_permissionGroupDelete | null;
}

export interface PermissionGroupDeleteVariables {
  id: string;
}
