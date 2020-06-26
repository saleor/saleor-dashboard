/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppTypeEnum, AppErrorCode, PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AppDelete
// ====================================================

export interface AppDelete_appDelete_app_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AppDelete_appDelete_app_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AppDelete_appDelete_app_tokens {
  __typename: "AppToken";
  authToken: string | null;
  id: string;
  name: string | null;
}

export interface AppDelete_appDelete_app_webhooks_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface AppDelete_appDelete_app_webhooks {
  __typename: "Webhook";
  id: string;
  name: string;
  isActive: boolean;
  app: AppDelete_appDelete_app_webhooks_app;
}

export interface AppDelete_appDelete_app {
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
  privateMetadata: (AppDelete_appDelete_app_privateMetadata | null)[];
  metadata: (AppDelete_appDelete_app_metadata | null)[];
  tokens: (AppDelete_appDelete_app_tokens | null)[] | null;
  webhooks: (AppDelete_appDelete_app_webhooks | null)[] | null;
}

export interface AppDelete_appDelete_errors {
  __typename: "AppError";
  field: string | null;
  message: string | null;
  code: AppErrorCode;
  permissions: PermissionEnum[] | null;
}

export interface AppDelete_appDelete {
  __typename: "AppDelete";
  app: AppDelete_appDelete_app | null;
  errors: AppDelete_appDelete_errors[];
}

export interface AppDelete {
  appDelete: AppDelete_appDelete | null;
}

export interface AppDeleteVariables {
  id: string;
}
