import { Plugin_plugin_channelConfigurations } from "@saleor/plugins/types/Plugin";

export const getAllChannelConfigsCount = (
  channelConfigurations: Plugin_plugin_channelConfigurations[]
) => channelConfigurations?.length;

export const getActiveChannelConfigsCount = (
  channelConfigurations: Plugin_plugin_channelConfigurations[]
) => channelConfigurations?.filter(({ active }) => !!active).length;
