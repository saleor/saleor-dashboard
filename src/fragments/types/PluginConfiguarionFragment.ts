/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ConfigurationTypeFieldEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: PluginConfiguarionFragment
// ====================================================

export interface PluginConfiguarionFragment_channel {
  __typename: "Channel";
  id: string;
  name: string;
  slug: string;
}

export interface PluginConfiguarionFragment_configuration {
  __typename: "ConfigurationItem";
  name: string;
  value: string | null;
  type: ConfigurationTypeFieldEnum | null;
  helpText: string | null;
  label: string | null;
}

export interface PluginConfiguarionFragment {
  __typename: "PluginConfiguration";
  active: boolean;
  channel: PluginConfiguarionFragment_channel | null;
  configuration: (PluginConfiguarionFragment_configuration | null)[] | null;
}
