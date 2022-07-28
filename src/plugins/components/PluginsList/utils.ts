import { Pill } from "@saleor/components/ChannelsAvailabilityMenuContent";
import { PluginConfigurationBaseFragment } from "@saleor/graphql";
import { PillColor } from "@saleor/macaw-ui";
import { MessageDescriptor } from "react-intl";

import { pluginStatusMessages } from "./messages";

export const getAllChannelConfigsCount = (
  channelConfigurations: PluginConfigurationBaseFragment[],
) => channelConfigurations?.length;

export const getActiveChannelConfigsCount = (
  channelConfigurations: PluginConfigurationBaseFragment[],
) => channelConfigurations?.filter(({ active }) => !!active).length;

export const getPluginStatusLabel = (
  channelData: PluginConfigurationBaseFragment,
): MessageDescriptor =>
  channelData.active
    ? pluginStatusMessages.active
    : pluginStatusMessages.deactivated;
export const getPluginStatusColor = (
  channelData: PluginConfigurationBaseFragment,
): PillColor => (channelData.active ? "success" : "error");

export const mapPluginsToPills = (
  channelConfigurations: PluginConfigurationBaseFragment[],
): Pill[] =>
  channelConfigurations.map(channel => ({
    channel: channel.channel,
    color: getPluginStatusColor(channel),
    label: getPluginStatusLabel(channel),
  }));
