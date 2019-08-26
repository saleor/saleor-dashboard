/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ConfigurationTypeFieldEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: pluginsDetailsFragment
// ====================================================

export interface pluginsDetailsFragment_configuration {
  __typename: "ConfigurationItem";
  name: string;
  type: ConfigurationTypeFieldEnum | null;
  value: string;
  helpText: string | null;
  label: string | null;
}

export interface pluginsDetailsFragment {
  __typename: "PluginConfiguration";
  id: string;
  name: string;
  description: string;
  active: boolean;
  configuration: (pluginsDetailsFragment_configuration | null)[] | null;
}
