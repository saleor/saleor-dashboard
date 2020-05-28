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

export interface AppDelete_appDelete_app_webhooks {
  __typename: "Webhook";
  name: string;
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
  privateMetadata: (AppDelete_appDelete_app_privateMetadata | null)[];
  metadata: (AppDelete_appDelete_app_metadata | null)[];
  webhooks: (AppDelete_appDelete_app_webhooks | null)[] | null;
}

export interface AppDelete_appDelete_appErrors {
  __typename: "AppError";
  field: string | null;
  message: string | null;
  code: AppErrorCode;
  permissions: PermissionEnum[] | null;
}

export interface AppDelete_appDelete {
  __typename: "AppDelete";
  app: AppDelete_appDelete_app | null;
  appErrors: AppDelete_appDelete_appErrors[];
}

export interface AppDelete {
  appDelete: AppDelete_appDelete | null;
}

export interface AppDeleteVariables {
  id: string;
}
