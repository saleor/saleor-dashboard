import { Pill } from "@dashboard/components/ChannelsAvailabilityMenuContent";
import { PluginConfigurationBaseFragment } from "@dashboard/graphql";
import { PillColor } from "@saleor/macaw-ui";
import { MessageDescriptor } from "react-intl";

import { pluginStatusMessages } from "./messages";

export const getActiveChannelConfigsCount = (
  channelConfigurations: PluginConfigurationBaseFragment[],
) => channelConfigurations?.filter(({ active }) => !!active).length;

const getPluginStatusLabel = (channelData: PluginConfigurationBaseFragment): MessageDescriptor =>
  channelData.active ? pluginStatusMessages.active : pluginStatusMessages.deactivated;
const getPluginStatusColor = (channelData: PluginConfigurationBaseFragment): PillColor =>
  channelData.active ? "success" : "error";

export const mapPluginsToPills = (
  channelConfigurations: PluginConfigurationBaseFragment[],
): Pill[] =>
  channelConfigurations.map(channel => ({
    channel: channel.channel,
    color: getPluginStatusColor(channel),
    label: getPluginStatusLabel(channel),
  }));
