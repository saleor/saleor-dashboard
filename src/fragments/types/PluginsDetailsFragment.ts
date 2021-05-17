/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ConfigurationTypeFieldEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: PluginsDetailsFragment
// ====================================================

export interface PluginsDetailsFragment_globalConfiguration_channel {
  __typename: "Channel";
  id: string;
  name: string;
  slug: string;
}

export interface PluginsDetailsFragment_globalConfiguration_configuration {
  __typename: "ConfigurationItem";
  name: string;
  value: string | null;
  type: ConfigurationTypeFieldEnum | null;
  helpText: string | null;
  label: string | null;
}

export interface PluginsDetailsFragment_globalConfiguration {
  __typename: "PluginConfiguration";
  active: boolean;
  channel: PluginsDetailsFragment_globalConfiguration_channel | null;
  configuration: (PluginsDetailsFragment_globalConfiguration_configuration | null)[] | null;
}

export interface PluginsDetailsFragment_channelConfigurations_channel {
  __typename: "Channel";
  id: string;
  name: string;
  slug: string;
}

export interface PluginsDetailsFragment_channelConfigurations_configuration {
  __typename: "ConfigurationItem";
  name: string;
  value: string | null;
  type: ConfigurationTypeFieldEnum | null;
  helpText: string | null;
  label: string | null;
}

export interface PluginsDetailsFragment_channelConfigurations {
  __typename: "PluginConfiguration";
  active: boolean;
  channel: PluginsDetailsFragment_channelConfigurations_channel | null;
  configuration: (PluginsDetailsFragment_channelConfigurations_configuration | null)[] | null;
}

export interface PluginsDetailsFragment {
  __typename: "Plugin";
  id: string;
  name: string;
  description: string;
  globalConfiguration: PluginsDetailsFragment_globalConfiguration | null;
  channelConfigurations: PluginsDetailsFragment_channelConfigurations[];
}
