/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PluginConfigurationUpdateInput, ConfigurationTypeFieldEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: PluginConfigurationUpdate
// ====================================================

export interface PluginConfigurationUpdate_pluginConfigurationUpdate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface PluginConfigurationUpdate_pluginConfigurationUpdate_pluginConfiguration_configuration {
  __typename: "ConfigurationItem";
  name: string;
  type: ConfigurationTypeFieldEnum | null;
  value: string;
  helpText: string | null;
  label: string | null;
}

export interface PluginConfigurationUpdate_pluginConfigurationUpdate_pluginConfiguration {
  __typename: "PluginConfiguration";
  id: string;
  name: string;
  description: string;
  active: boolean;
  configuration: (PluginConfigurationUpdate_pluginConfigurationUpdate_pluginConfiguration_configuration | null)[] | null;
}

export interface PluginConfigurationUpdate_pluginConfigurationUpdate {
  __typename: "PluginConfigurationUpdate";
  errors: PluginConfigurationUpdate_pluginConfigurationUpdate_errors[] | null;
  pluginConfiguration: PluginConfigurationUpdate_pluginConfigurationUpdate_pluginConfiguration | null;
}

export interface PluginConfigurationUpdate {
  pluginConfigurationUpdate: PluginConfigurationUpdate_pluginConfigurationUpdate | null;
}

export interface PluginConfigurationUpdateVariables {
  id: string;
  input: PluginConfigurationUpdateInput;
}
