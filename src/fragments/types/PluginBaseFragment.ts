/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PluginBaseFragment
// ====================================================

export interface PluginBaseFragment_channelConfigurations_channel {
  __typename: "Channel";
  id: string;
  name: string;
  slug: string;
}

export interface PluginBaseFragment_channelConfigurations {
  __typename: "PluginConfiguration";
  active: boolean;
  channel: PluginBaseFragment_channelConfigurations_channel | null;
}

export interface PluginBaseFragment_globalConfiguration_channel {
  __typename: "Channel";
  id: string;
  name: string;
  slug: string;
}

export interface PluginBaseFragment_globalConfiguration {
  __typename: "PluginConfiguration";
  active: boolean;
  channel: PluginBaseFragment_globalConfiguration_channel | null;
}

export interface PluginBaseFragment {
  __typename: "Plugin";
  id: string;
  name: string;
  description: string;
  channelConfigurations: PluginBaseFragment_channelConfigurations[];
  globalConfiguration: PluginBaseFragment_globalConfiguration | null;
}
