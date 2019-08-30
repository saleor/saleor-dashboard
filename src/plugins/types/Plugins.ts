/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Plugins
// ====================================================

export interface Plugins_plugins_edges_node {
  __typename: "Plugin";
  id: string;
  name: string;
  description: string;
  active: boolean;
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
}
