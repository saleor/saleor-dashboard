/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppTypeEnum, PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: App
// ====================================================

export interface App_app_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface App_app_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface App_app_tokens {
  __typename: "AppToken";
  authToken: string | null;
  id: string;
  name: string | null;
}

export interface App_app_webhooks_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface App_app_webhooks {
  __typename: "Webhook";
  id: string;
  name: string;
  isActive: boolean;
  app: App_app_webhooks_app;
}

export interface App_app_permissions {
  __typename: "Permission";
  code: PermissionEnum;
  name: string;
}

export interface App_app {
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
  privateMetadata: (App_app_privateMetadata | null)[];
  metadata: (App_app_metadata | null)[];
  tokens: (App_app_tokens | null)[] | null;
  webhooks: (App_app_webhooks | null)[] | null;
  aboutApp: string | null;
  permissions: (App_app_permissions | null)[] | null;
  dataPrivacy: string | null;
  dataPrivacyUrl: string | null;
}

export interface App {
  app: App_app | null;
}

export interface AppVariables {
  id: string;
}
