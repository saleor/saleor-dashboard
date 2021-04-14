import {
  Plugin_plugin_channelConfigurations,
  Plugin_plugin_globalConfiguration
} from "@saleor/plugins/types/Plugin";

export const isPluginGlobal = (
  globalConfiguration: Plugin_plugin_globalConfiguration
) => !!globalConfiguration;

export const getAllChannelConfigsCount = (
  channelConfigurations: Plugin_plugin_channelConfigurations[]
) => channelConfigurations?.length;

export const getActiveChannelConfigsCount = (
  channelConfigurations: Plugin_plugin_channelConfigurations[]
) => channelConfigurations?.filter(({ active }) => !!active).length;
