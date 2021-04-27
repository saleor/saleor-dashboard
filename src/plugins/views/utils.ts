import { Plugin_plugin_globalConfiguration } from "@saleor/plugins/types/Plugin";

export const isPluginGlobal = (
  globalConfiguration: Plugin_plugin_globalConfiguration
) => !!globalConfiguration;
