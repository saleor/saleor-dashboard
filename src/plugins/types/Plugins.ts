/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PluginFilterInput, PluginSortingInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: Plugins
// ====================================================

export interface Plugins_plugins_edges_node_channelConfigurations_channel {
  __typename: "Channel";
  id: string;
  name: string;
  slug: string;
}

export interface Plugins_plugins_edges_node_channelConfigurations {
  __typename: "PluginConfiguration";
  active: boolean;
  channel: Plugins_plugins_edges_node_channelConfigurations_channel | null;
}

export interface Plugins_plugins_edges_node_globalConfiguration_channel {
  __typename: "Channel";
  id: string;
  name: string;
  slug: string;
}

export interface Plugins_plugins_edges_node_globalConfiguration {
  __typename: "PluginConfiguration";
  active: boolean;
  channel: Plugins_plugins_edges_node_globalConfiguration_channel | null;
}

export interface Plugins_plugins_edges_node {
  __typename: "Plugin";
  id: string;
  name: string;
  description: string;
  channelConfigurations: Plugins_plugins_edges_node_channelConfigurations[];
  globalConfiguration: Plugins_plugins_edges_node_globalConfiguration | null;
}

export interface Plugins_plugins_edges {
  __typename: "PluginCountableEdge";
  node: Plugins_plugins_edges_node;
}

export interface Plugins_plugins_pageInfo {
  __typename: "PageInfo";
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface Plugins_plugins {
  __typename: "PluginCountableConnection";
  edges: Plugins_plugins_edges[];
  pageInfo: Plugins_plugins_pageInfo;
}

export interface Plugins {
  plugins: Plugins_plugins | null;
}

export interface PluginsVariables {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
  filter?: PluginFilterInput | null;
  sort?: PluginSortingInput | null;
}
