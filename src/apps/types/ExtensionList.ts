/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AppExtensionFilterInput, AppExtensionViewEnum, AppExtensionTypeEnum, AppExtensionTargetEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ExtensionList
// ====================================================

export interface ExtensionList_appExtensions_edges_node {
  __typename: "AppExtension";
  id: string;
  label: string;
  url: string;
  view: AppExtensionViewEnum;
  type: AppExtensionTypeEnum;
  target: AppExtensionTargetEnum;
  accessToken: string | null;
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
