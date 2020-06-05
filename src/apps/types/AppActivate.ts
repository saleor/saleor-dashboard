/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppErrorCode, PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AppActivate
// ====================================================

export interface AppActivate_appActivate_errors {
  __typename: "AppError";
  field: string | null;
  message: string | null;
  code: AppErrorCode;
  permissions: PermissionEnum[] | null;
}

export interface AppActivate_appActivate {
  __typename: "AppActivate";
  errors: AppActivate_appActivate_errors[];
}

export interface AppActivate {
  appActivate: AppActivate_appActivate | null;
}

export interface AppActivateVariables {
  id: string;
}
