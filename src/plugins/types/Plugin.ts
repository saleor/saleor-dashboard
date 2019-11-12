/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ConfigurationTypeFieldEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: Plugin
// ====================================================

export interface Plugin_plugin_configuration {
  __typename: "ConfigurationItem";
  name: string;
  type: ConfigurationTypeFieldEnum | null;
  value: string | null;
  helpText: string | null;
  label: string | null;
}

export interface Plugin_plugin {
  __typename: "Plugin";
  id: string;
  name: string;
  description: string;
  active: boolean;
  configuration: (Plugin_plugin_configuration | null)[] | null;
}

export interface Plugin {
  plugin: Plugin_plugin | null;
}

export interface PluginVariables {
  id: string;
}
