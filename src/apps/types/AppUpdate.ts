/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppInput, AppTypeEnum, PermissionEnum, AppErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AppUpdate
// ====================================================

export interface AppUpdate_appUpdate_app_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AppUpdate_appUpdate_app_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AppUpdate_appUpdate_app_tokens {
  __typename: "AppToken";
  authToken: string | null;
  id: string;
  name: string | null;
}

export interface AppUpdate_appUpdate_app_webhooks_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface AppUpdate_appUpdate_app_webhooks {
  __typename: "Webhook";
  id: string;
  name: string;
  isActive: boolean;
  app: AppUpdate_appUpdate_app_webhooks_app;
}

export interface AppUpdate_appUpdate_app_permissions {
  __typename: "Permission";
  code: PermissionEnum;
  name: string;
}

export interface AppUpdate_appUpdate_app {
  __typename: "App";
  id: string;
  name: string | null;
  created: any | null;
  isActive: boolean | null;
  type: AppTypeEnum | null;
  homepageUrl: string | null;
  appUrl: string | null;
  configurationUrl: string | null;
  supportUrl: string | null;
  version: string | null;
  accessToken: string | null;
  privateMetadata: (AppUpdate_appUpdate_app_privateMetadata | null)[];
  metadata: (AppUpdate_appUpdate_app_metadata | null)[];
  tokens: (AppUpdate_appUpdate_app_tokens | null)[] | null;
  webhooks: (AppUpdate_appUpdate_app_webhooks | null)[] | null;
  permissions: (AppUpdate_appUpdate_app_permissions | null)[] | null;
}

export interface AppUpdate_appUpdate_errors {
  __typename: "AppError";
  field: string | null;
  message: string | null;
  code: AppErrorCode;
  permissions: PermissionEnum[] | null;
}

export interface AppUpdate_appUpdate {
  __typename: "AppUpdate";
  app: AppUpdate_appUpdate_app | null;
  errors: AppUpdate_appUpdate_errors[];
}

export interface AppUpdate {
  appUpdate: AppUpdate_appUpdate | null;
}

export interface AppUpdateVariables {
  id: string;
  input: AppInput;
}
