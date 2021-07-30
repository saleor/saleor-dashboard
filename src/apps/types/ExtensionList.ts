/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AppExtensionFilterInput, AppExtensionViewEnum, AppExtensionTypeEnum, AppExtensionTargetEnum, AppTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ExtensionList
// ====================================================

export interface ExtensionList_appExtensions_edges_node_app_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ExtensionList_appExtensions_edges_node_app_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ExtensionList_appExtensions_edges_node_app_tokens {
  __typename: "AppToken";
  authToken: string | null;
  id: string;
  name: string | null;
}

export interface ExtensionList_appExtensions_edges_node_app_webhooks_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface ExtensionList_appExtensions_edges_node_app_webhooks {
  __typename: "Webhook";
  id: string;
  name: string;
  isActive: boolean;
  app: ExtensionList_appExtensions_edges_node_app_webhooks_app;
}

export interface ExtensionList_appExtensions_edges_node_app {
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
  privateMetadata: (ExtensionList_appExtensions_edges_node_app_privateMetadata | null)[];
  metadata: (ExtensionList_appExtensions_edges_node_app_metadata | null)[];
  tokens: (ExtensionList_appExtensions_edges_node_app_tokens | null)[] | null;
  webhooks: (ExtensionList_appExtensions_edges_node_app_webhooks | null)[] | null;
}

export interface ExtensionList_appExtensions_edges_node {
  __typename: "AppExtension";
  id: string;
  label: string;
  url: string;
  view: AppExtensionViewEnum;
  type: AppExtensionTypeEnum;
  target: AppExtensionTargetEnum;
  app: ExtensionList_appExtensions_edges_node_app;
}

export interface ExtensionList_appExtensions_edges {
  __typename: "AppExtensionCountableEdge";
  node: ExtensionList_appExtensions_edges_node;
}

export interface ExtensionList_appExtensions {
  __typename: "AppExtensionCountableConnection";
  edges: ExtensionList_appExtensions_edges[];
}

export interface ExtensionList {
  appExtensions: ExtensionList_appExtensions | null;
}

export interface ExtensionListVariables {
  filter: AppExtensionFilterInput;
}
