/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ConfigurationTypeFieldEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: PluginConfigurationFragment
// ====================================================

export interface PluginConfigurationFragment_channel {
  __typename: "Channel";
  id: string;
  name: string;
  slug: string;
}

export interface PluginConfigurationFragment_configuration {
  __typename: "ConfigurationItem";
  name: string;
  value: string | null;
  type: ConfigurationTypeFieldEnum | null;
  helpText: string | null;
  label: string | null;
}

export interface PluginConfigurationFragment {
  __typename: "PluginConfiguration";
  active: boolean;
  channel: PluginConfigurationFragment_channel | null;
  configuration: (PluginConfigurationFragment_configuration | null)[] | null;
}
