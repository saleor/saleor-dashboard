/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PluginConfigurationUpdateInput, ConfigurationTypeFieldEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: pluginConfigurationUpdate
// ====================================================

export interface pluginConfigurationUpdate_pluginConfigurationUpdate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface pluginConfigurationUpdate_pluginConfigurationUpdate_pluginConfiguration_configuration {
  __typename: "ConfigurationItem";
  name: string;
  type: ConfigurationTypeFieldEnum | null;
  value: string;
  helpText: string | null;
  label: string | null;
}

export interface pluginConfigurationUpdate_pluginConfigurationUpdate_pluginConfiguration {
  __typename: "PluginConfiguration";
  id: string;
  name: string;
  description: string;
  active: boolean;
  configuration: (pluginConfigurationUpdate_pluginConfigurationUpdate_pluginConfiguration_configuration | null)[] | null;
}

export interface pluginConfigurationUpdate_pluginConfigurationUpdate {
  __typename: "PluginConfigurationUpdate";
  errors: pluginConfigurationUpdate_pluginConfigurationUpdate_errors[] | null;
  pluginConfiguration: pluginConfigurationUpdate_pluginConfigurationUpdate_pluginConfiguration | null;
}

export interface pluginConfigurationUpdate {
  pluginConfigurationUpdate: pluginConfigurationUpdate_pluginConfigurationUpdate | null;
}

export interface pluginConfigurationUpdateVariables {
  id: string;
  input: PluginConfigurationUpdateInput;
}
