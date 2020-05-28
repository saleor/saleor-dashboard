/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppInstallInput, JobStatusEnum, AppErrorCode, PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AppInstall
// ====================================================

export interface AppInstall_appInstall_appInstallation {
  __typename: "AppInstallation";
  id: string;
  status: JobStatusEnum;
  appName: string;
  manifestUrl: string;
}

export interface AppInstall_appInstall_appErrors {
  __typename: "AppError";
  field: string | null;
  message: string | null;
  code: AppErrorCode;
  permissions: PermissionEnum[] | null;
}

export interface AppInstall_appInstall {
  __typename: "AppInstall";
  appInstallation: AppInstall_appInstall_appInstallation | null;
  appErrors: AppInstall_appInstall_appErrors[];
}

export interface AppInstall {
  appInstall: AppInstall_appInstall | null;
}

export interface AppInstallVariables {
  input: AppInstallInput;
}
