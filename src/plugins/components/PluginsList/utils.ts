import { PluginConfigurationBaseFragment } from "@saleor/fragments/types/PluginConfigurationBaseFragment";

import { pluginStatusMessages } from "./messages";

export const getAllChannelConfigsCount = (
  channelConfigurations: PluginConfigurationBaseFragment[]
) => channelConfigurations?.length;

export const getActiveChannelConfigsCount = (
  channelConfigurations: PluginConfigurationBaseFragment[]
) => channelConfigurations?.filter(({ active }) => !!active).length;

export const getPluginStatusLabel = (
  channelData: PluginConfigurationBaseFragment
) =>
  channelData.active
    ? pluginStatusMessages.active
    : pluginStatusMessages.inactive;
export const getPluginStatusColor = (
  channelData: PluginConfigurationBaseFragment
) => (channelData.active ? "success" : "error");
