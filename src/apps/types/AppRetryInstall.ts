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

export interface AppRetryInstall_appRetryInstall_appErrors {
  __typename: "AppError";
  field: string | null;
  message: string | null;
  code: AppErrorCode;
  permissions: PermissionEnum[] | null;
}

export interface AppRetryInstall_appRetryInstall {
  __typename: "AppRetryInstall";
  appInstallation: AppRetryInstall_appRetryInstall_appInstallation | null;
  appErrors: AppRetryInstall_appRetryInstall_appErrors[];
}

export interface AppRetryInstall {
  appRetryInstall: AppRetryInstall_appRetryInstall | null;
}

export interface AppRetryInstallVariables {
  id: string;
}
