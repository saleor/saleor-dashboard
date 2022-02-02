/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AppExtensionFilterInput, AppExtensionMountEnum, AppExtensionTargetEnum, PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ExtensionList
// ====================================================

export interface ExtensionList_appExtensions_edges_node_permissions {
  __typename: "Permission";
  code: PermissionEnum;
}

export interface ExtensionList_appExtensions_edges_node_app {
  __typename: "App";
  id: string;
  appUrl: string | null;
}

export interface ExtensionList_appExtensions_edges_node {
  __typename: "AppExtension";
  id: string;
  label: string;
  url: string;
  mount: AppExtensionMountEnum;
  target: AppExtensionTargetEnum;
  accessToken: string | null;
  permissions: ExtensionList_appExtensions_edges_node_permissions[];
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
