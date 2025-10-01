import { PluginConfigurationBaseFragment } from "@dashboard/graphql";

export const isPluginGlobal = (globalConfiguration: PluginConfigurationBaseFragment) =>
  !!globalConfiguration;
