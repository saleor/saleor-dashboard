/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppTokenInput, AppErrorCode, PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AppTokenCreate
// ====================================================

export interface AppTokenCreate_appTokenCreate_appToken {
  __typename: "AppToken";
  name: string | null;
  authToken: string | null;
  id: string;
}

export interface AppTokenCreate_appTokenCreate_errors {
  __typename: "AppError";
  field: string | null;
  message: string | null;
  code: AppErrorCode;
  permissions: PermissionEnum[] | null;
}

export interface AppTokenCreate_appTokenCreate {
  __typename: "AppTokenCreate";
  appToken: AppTokenCreate_appTokenCreate_appToken | null;
  authToken: string | null;
  errors: AppTokenCreate_appTokenCreate_errors[];
}

export interface AppTokenCreate {
  appTokenCreate: AppTokenCreate_appTokenCreate | null;
}

export interface AppTokenCreateVariables {
  input: AppTokenInput;
}
