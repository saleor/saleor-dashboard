/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ConfigurationTypeFieldEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: Plugin
// ====================================================

export interface Plugin_plugin_globalConfiguration_channel {
  __typename: "Channel";
  id: string;
  name: string;
  slug: string;
}

export interface Plugin_plugin_globalConfiguration_configuration {
  __typename: "ConfigurationItem";
  name: string;
  value: string | null;
  type: ConfigurationTypeFieldEnum | null;
  helpText: string | null;
  label: string | null;
}

export interface Plugin_plugin_globalConfiguration {
  __typename: "PluginConfiguration";
  active: boolean;
  channel: Plugin_plugin_globalConfiguration_channel | null;
  configuration: (Plugin_plugin_globalConfiguration_configuration | null)[] | null;
}

export interface Plugin_plugin_channelConfigurations_channel {
  __typename: "Channel";
  id: string;
  name: string;
  slug: string;
}

export interface Plugin_plugin_channelConfigurations_configuration {
  __typename: "ConfigurationItem";
  name: string;
  value: string | null;
  type: ConfigurationTypeFieldEnum | null;
  helpText: string | null;
  label: string | null;
}

export interface Plugin_plugin_channelConfigurations {
  __typename: "PluginConfiguration";
  active: boolean;
  channel: Plugin_plugin_channelConfigurations_channel | null;
  configuration: (Plugin_plugin_channelConfigurations_configuration | null)[] | null;
}

export interface Plugin_plugin {
  __typename: "Plugin";
  id: string;
  name: string;
  description: string;
  globalConfiguration: Plugin_plugin_globalConfiguration | null;
  channelConfigurations: Plugin_plugin_channelConfigurations[];
}

export interface Plugin {
  plugin: Plugin_plugin | null;
}

export interface PluginVariables {
  id: string;
}
