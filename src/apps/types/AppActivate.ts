/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppErrorCode, PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AppActivate
// ====================================================

export interface AppActivate_appActivate_appErrors {
  __typename: "AppError";
  field: string | null;
  message: string | null;
  code: AppErrorCode;
  permissions: PermissionEnum[] | null;
}

export interface AppActivate_appActivate {
  __typename: "AppActivate";
  appErrors: AppActivate_appActivate_appErrors[];
}

export interface AppActivate {
  appActivate: AppActivate_appActivate | null;
}

export interface AppActivateVariables {
  id: string;
}
