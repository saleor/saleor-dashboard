/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ConfigurationTypeFieldEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: PluginConfiguration
// ====================================================

export interface PluginConfiguration_pluginConfiguration_configuration {
  __typename: "ConfigurationItem";
  name: string;
  type: ConfigurationTypeFieldEnum | null;
  value: string;
  helpText: string | null;
  label: string | null;
}

export interface PluginConfiguration_pluginConfiguration {
  __typename: "PluginConfiguration";
  id: string;
  name: string;
  description: string;
  active: boolean;
  configuration: (PluginConfiguration_pluginConfiguration_configuration | null)[] | null;
}

export interface PluginConfiguration {
  pluginConfiguration: PluginConfiguration_pluginConfiguration | null;
}

export interface PluginConfigurationVariables {
  id: string;
}
