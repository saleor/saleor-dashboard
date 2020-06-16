/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { JobStatusEnum, AppErrorCode, PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AppDeleteFailedInstallation
// ====================================================

export interface AppDeleteFailedInstallation_appDeleteFailedInstallation_appInstallation {
  __typename: "AppInstallation";
  id: string;
  status: JobStatusEnum;
  appName: string;
  message: string | null;
}

export interface AppDeleteFailedInstallation_appDeleteFailedInstallation_errors {
  __typename: "AppError";
  field: string | null;
  message: string | null;
  code: AppErrorCode;
  permissions: PermissionEnum[] | null;
}

export interface AppDeleteFailedInstallation_appDeleteFailedInstallation {
  __typename: "AppDeleteFailedInstallation";
  appInstallation: AppDeleteFailedInstallation_appDeleteFailedInstallation_appInstallation | null;
  errors: AppDeleteFailedInstallation_appDeleteFailedInstallation_errors[];
}

export interface AppDeleteFailedInstallation {
  appDeleteFailedInstallation: AppDeleteFailedInstallation_appDeleteFailedInstallation | null;
}

export interface AppDeleteFailedInstallationVariables {
  id: string;
}
