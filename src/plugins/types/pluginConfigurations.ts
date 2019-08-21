/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: pluginConfigurations
// ====================================================

export interface pluginConfigurations_pluginConfigurations_edges_node {
  __typename: "PluginConfiguration";
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface pluginConfigurations_pluginConfigurations_edges {
  __typename: "PluginConfigurationCountableEdge";
  node: pluginConfigurations_pluginConfigurations_edges_node;
}

export interface pluginConfigurations_pluginConfigurations {
  __typename: "PluginConfigurationCountableConnection";
  edges: pluginConfigurations_pluginConfigurations_edges[];
}

export interface pluginConfigurations {
  pluginConfigurations: pluginConfigurations_pluginConfigurations | null;
}

export interface pluginConfigurationsVariables {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
