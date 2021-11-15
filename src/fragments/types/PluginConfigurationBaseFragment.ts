/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PluginConfigurationBaseFragment
// ====================================================

export interface PluginConfigurationBaseFragment_channel {
  __typename: "Channel";
  id: string;
  name: string;
  slug: string;
}

export interface PluginConfigurationBaseFragment {
  __typename: "PluginConfiguration";
  active: boolean;
  channel: PluginConfigurationBaseFragment_channel | null;
}
