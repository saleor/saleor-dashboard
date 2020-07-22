/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PermissionEnum, AppErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AppFetch
// ====================================================

export interface AppFetch_appFetchManifest_manifest_permissions {
  __typename: "Permission";
  code: PermissionEnum;
  name: string;
}

export interface AppFetch_appFetchManifest_manifest {
  __typename: "Manifest";
  identifier: string;
  version: string;
  about: string | null;
  name: string;
  appUrl: string | null;
  configurationUrl: string | null;
  tokenTargetUrl: string | null;
  dataPrivacy: string | null;
  dataPrivacyUrl: string | null;
  homepageUrl: string | null;
  supportUrl: string | null;
  permissions: (AppFetch_appFetchManifest_manifest_permissions | null)[] | null;
}

export interface AppFetch_appFetchManifest_errors {
  __typename: "AppError";
  field: string | null;
  message: string | null;
  code: AppErrorCode;
  permissions: PermissionEnum[] | null;
}

export interface AppFetch_appFetchManifest {
  __typename: "AppFetchManifest";
  manifest: AppFetch_appFetchManifest_manifest | null;
  errors: AppFetch_appFetchManifest_errors[];
}

export interface AppFetch {
  appFetchManifest: AppFetch_appFetchManifest | null;
}

export interface AppFetchVariables {
  manifestUrl: string;
}
