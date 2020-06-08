/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppErrorCode, PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AppTokenDelete
// ====================================================

export interface AppTokenDelete_appTokenDelete_appToken {
  __typename: "AppToken";
  name: string | null;
  authToken: string | null;
  id: string;
}

export interface AppTokenDelete_appTokenDelete_errors {
  __typename: "AppError";
  field: string | null;
  message: string | null;
  code: AppErrorCode;
  permissions: PermissionEnum[] | null;
}

export interface AppTokenDelete_appTokenDelete {
  __typename: "AppTokenDelete";
  appToken: AppTokenDelete_appTokenDelete_appToken | null;
  errors: AppTokenDelete_appTokenDelete_errors[];
}

export interface AppTokenDelete {
  appTokenDelete: AppTokenDelete_appTokenDelete | null;
}

export interface AppTokenDeleteVariables {
  id: string;
}
