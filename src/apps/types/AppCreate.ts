/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppInput, AppTypeEnum, AppErrorCode, PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AppCreate
// ====================================================

export interface AppCreate_appCreate_app_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AppCreate_appCreate_app_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AppCreate_appCreate_app_webhooks {
  __typename: "Webhook";
  name: string;
}

export interface AppCreate_appCreate_app {
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
  privateMetadata: (AppCreate_appCreate_app_privateMetadata | null)[];
  metadata: (AppCreate_appCreate_app_metadata | null)[];
  webhooks: (AppCreate_appCreate_app_webhooks | null)[] | null;
}

export interface AppCreate_appCreate_appErrors {
  __typename: "AppError";
  field: string | null;
  message: string | null;
  code: AppErrorCode;
  permissions: PermissionEnum[] | null;
}

export interface AppCreate_appCreate {
  __typename: "AppCreate";
  authToken: string | null;
  app: AppCreate_appCreate_app | null;
  appErrors: AppCreate_appCreate_appErrors[];
}

export interface AppCreate {
  appCreate: AppCreate_appCreate | null;
}

export interface AppCreateVariables {
  input: AppInput;
}
