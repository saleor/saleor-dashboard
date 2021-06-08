/* tslint:disable */
/* eslint-disable */
// @generated
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

export interface PluginUpdate_pluginUpdate_plugin_globalConfiguration_channel {
  __typename: "Channel";
  id: string;
  name: string;
  slug: string;
}

export interface PluginUpdate_pluginUpdate_plugin_globalConfiguration_configuration {
  __typename: "ConfigurationItem";
  name: string;
  value: string | null;
  type: ConfigurationTypeFieldEnum | null;
  helpText: string | null;
  label: string | null;
}

export interface PluginUpdate_pluginUpdate_plugin_globalConfiguration {
  __typename: "PluginConfiguration";
  active: boolean;
  channel: PluginUpdate_pluginUpdate_plugin_globalConfiguration_channel | null;
  configuration: (PluginUpdate_pluginUpdate_plugin_globalConfiguration_configuration | null)[] | null;
}

export interface PluginUpdate_pluginUpdate_plugin_channelConfigurations_channel {
  __typename: "Channel";
  id: string;
  name: string;
  slug: string;
}

export interface PluginUpdate_pluginUpdate_plugin_channelConfigurations_configuration {
  __typename: "ConfigurationItem";
  name: string;
  value: string | null;
  type: ConfigurationTypeFieldEnum | null;
  helpText: string | null;
  label: string | null;
}

export interface PluginUpdate_pluginUpdate_plugin_channelConfigurations {
  __typename: "PluginConfiguration";
  active: boolean;
  channel: PluginUpdate_pluginUpdate_plugin_channelConfigurations_channel | null;
  configuration: (PluginUpdate_pluginUpdate_plugin_channelConfigurations_configuration | null)[] | null;
}

export interface PluginUpdate_pluginUpdate_plugin {
  __typename: "Plugin";
  id: string;
  name: string;
  description: string;
  globalConfiguration: PluginUpdate_pluginUpdate_plugin_globalConfiguration | null;
  channelConfigurations: PluginUpdate_pluginUpdate_plugin_channelConfigurations[];
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
  channelId?: string | null;
  id: string;
  input: PluginUpdateInput;
}
