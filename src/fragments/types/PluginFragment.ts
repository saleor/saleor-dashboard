/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ConfigurationTypeFieldEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: PluginFragment
// ====================================================

export interface PluginFragment_globalConfiguration_channel {
  __typename: "Channel";
  id: string;
  name: string;
  slug: string;
}

export interface PluginFragment_globalConfiguration_configuration {
  __typename: "ConfigurationItem";
  name: string;
  value: string | null;
  type: ConfigurationTypeFieldEnum | null;
  helpText: string | null;
  label: string | null;
}

export interface PluginFragment_globalConfiguration {
  __typename: "PluginConfiguration";
  active: boolean;
  channel: PluginFragment_globalConfiguration_channel | null;
  configuration: (PluginFragment_globalConfiguration_configuration | null)[] | null;
}

export interface PluginFragment_channelConfigurations_channel {
  __typename: "Channel";
  id: string;
  name: string;
  slug: string;
}

export interface PluginFragment_channelConfigurations_configuration {
  __typename: "ConfigurationItem";
  name: string;
  value: string | null;
  type: ConfigurationTypeFieldEnum | null;
  helpText: string | null;
  label: string | null;
}

export interface PluginFragment_channelConfigurations {
  __typename: "PluginConfiguration";
  active: boolean;
  channel: PluginFragment_channelConfigurations_channel | null;
  configuration: (PluginFragment_channelConfigurations_configuration | null)[] | null;
}

export interface PluginFragment {
  __typename: "Plugin";
  id: string;
  name: string;
  description: string;
  globalConfiguration: PluginFragment_globalConfiguration | null;
  channelConfigurations: PluginFragment_channelConfigurations[];
}
