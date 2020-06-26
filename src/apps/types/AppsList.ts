/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppSortingInput, AppFilterInput, AppTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: AppsList
// ====================================================

export interface AppsList_apps_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface AppsList_apps_edges_node_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AppsList_apps_edges_node_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AppsList_apps_edges_node_tokens {
  __typename: "AppToken";
  authToken: string | null;
  id: string;
  name: string | null;
}

export interface AppsList_apps_edges_node_webhooks_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface AppsList_apps_edges_node_webhooks {
  __typename: "Webhook";
  id: string;
  name: string;
  isActive: boolean;
  app: AppsList_apps_edges_node_webhooks_app;
}

export interface AppsList_apps_edges_node {
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
  privateMetadata: (AppsList_apps_edges_node_privateMetadata | null)[];
  metadata: (AppsList_apps_edges_node_metadata | null)[];
  tokens: (AppsList_apps_edges_node_tokens | null)[] | null;
  webhooks: (AppsList_apps_edges_node_webhooks | null)[] | null;
}

export interface AppsList_apps_edges {
  __typename: "AppCountableEdge";
  node: AppsList_apps_edges_node;
}

export interface AppsList_apps {
  __typename: "AppCountableConnection";
  pageInfo: AppsList_apps_pageInfo;
  totalCount: number | null;
  edges: AppsList_apps_edges[];
}

export interface AppsList {
  apps: AppsList_apps | null;
}

export interface AppsListVariables {
  before?: string | null;
  after?: string | null;
  first?: number | null;
  last?: number | null;
  sort?: AppSortingInput | null;
  filter?: AppFilterInput | null;
}
