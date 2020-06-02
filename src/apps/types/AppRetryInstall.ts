/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { JobStatusEnum, AppErrorCode, PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AppRetryInstall
// ====================================================

export interface AppRetryInstall_appRetryInstall_appInstallation {
  __typename: "AppInstallation";
  id: string;
  status: JobStatusEnum;
  appName: string;
  manifestUrl: string;
}

export interface AppRetryInstall_appRetryInstall_errors {
  __typename: "AppError";
  field: string | null;
  message: string | null;
  code: AppErrorCode;
  permissions: PermissionEnum[] | null;
}

export interface AppRetryInstall_appRetryInstall {
  __typename: "AppRetryInstall";
  appInstallation: AppRetryInstall_appRetryInstall_appInstallation | null;
  errors: AppRetryInstall_appRetryInstall_errors[];
}

export interface AppRetryInstall {
  appRetryInstall: AppRetryInstall_appRetryInstall | null;
}

export interface AppRetryInstallVariables {
  id: string;
}
