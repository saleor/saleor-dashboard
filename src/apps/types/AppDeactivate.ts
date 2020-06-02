/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppErrorCode, PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AppDeactivate
// ====================================================

export interface AppDeactivate_appDeactivate_errors {
  __typename: "AppError";
  field: string | null;
  message: string | null;
  code: AppErrorCode;
  permissions: PermissionEnum[] | null;
}

export interface AppDeactivate_appDeactivate {
  __typename: "AppDeactivate";
  errors: AppDeactivate_appDeactivate_errors[];
}

export interface AppDeactivate {
  appDeactivate: AppDeactivate_appDeactivate | null;
}

export interface AppDeactivateVariables {
  id: string;
}
