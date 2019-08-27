/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PluginConfigurations
// ====================================================

export interface PluginConfigurations_pluginConfigurations_edges_node {
  __typename: "PluginConfiguration";
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface PluginConfigurations_pluginConfigurations_edges {
  __typename: "PluginConfigurationCountableEdge";
  node: PluginConfigurations_pluginConfigurations_edges_node;
}

export interface PluginConfigurations_pluginConfigurations_pageInfo {
  __typename: "PageInfo";
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface PluginConfigurations_pluginConfigurations {
  __typename: "PluginConfigurationCountableConnection";
  edges: PluginConfigurations_pluginConfigurations_edges[];
  pageInfo: PluginConfigurations_pluginConfigurations_pageInfo;
}

export interface PluginConfigurations {
  pluginConfigurations: PluginConfigurations_pluginConfigurations | null;
}

export interface PluginConfigurationsVariables {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
