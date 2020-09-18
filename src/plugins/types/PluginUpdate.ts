/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PluginUpdateInput, PluginErrorCode, ConfigurationTypeFieldEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: PluginUpdate
// ====================================================

export interface PluginUpdate_pluginUpdate_errors {
  __typename: "PluginError";
  code: PluginErrorCode;
  field: string | null;
}

export interface PluginUpdate_pluginUpdate_plugin_configuration {
  __typename: "ConfigurationItem";
  name: string;
  type: ConfigurationTypeFieldEnum | null;
  value: string | null;
  helpText: string | null;
  label: string | null;
}

export interface PluginUpdate_pluginUpdate_plugin {
  __typename: "Plugin";
  id: string;
  name: string;
  description: string;
  active: boolean;
  configuration: (PluginUpdate_pluginUpdate_plugin_configuration | null)[] | null;
}

export interface PluginUpdate_pluginUpdate {
  __typename: "PluginUpdate";
  errors: PluginUpdate_pluginUpdate_errors[];
  plugin: PluginUpdate_pluginUpdate_plugin | null;
}

export interface PluginUpdate {
  pluginUpdate: PluginUpdate_pluginUpdate | null;
}

export interface PluginUpdateVariables {
  id: string;
  input: PluginUpdateInput;
}
