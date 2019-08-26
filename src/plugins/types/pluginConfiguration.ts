/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ConfigurationTypeFieldEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: pluginConfiguration
// ====================================================

export interface pluginConfiguration_pluginConfiguration_configuration {
  __typename: "ConfigurationItem";
  name: string;
  type: ConfigurationTypeFieldEnum | null;
  value: string;
  helpText: string | null;
  label: string | null;
}

export interface pluginConfiguration_pluginConfiguration {
  __typename: "PluginConfiguration";
  id: string;
  name: string;
  description: string;
  active: boolean;
  configuration: (pluginConfiguration_pluginConfiguration_configuration | null)[] | null;
}

export interface pluginConfiguration {
  pluginConfiguration: pluginConfiguration_pluginConfiguration | null;
}

export interface pluginConfigurationVariables {
  id: string;
}
