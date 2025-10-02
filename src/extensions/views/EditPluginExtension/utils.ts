import { pluginStatusMessages } from "@dashboard/extensions/views/EditPluginExtension/messages";
import {
  ConfigurationItemFragment,
  ConfigurationTypeFieldEnum,
  PluginConfigurationBaseFragment,
} from "@dashboard/graphql";
import { PillColor } from "@saleor/macaw-ui";
import { MessageDescriptor } from "react-intl";

export const isPluginGlobal = (globalConfiguration: PluginConfigurationBaseFragment) =>
  !!globalConfiguration;

export const getConfigByChannelId =
  (channelIdToCompare: string) =>
  ({ channel }: { channel: { id: string } }) =>
    channel.id === channelIdToCompare;

export function isSecretField(config: ConfigurationItemFragment[], field: string) {
  return [
    ConfigurationTypeFieldEnum.PASSWORD,
    ConfigurationTypeFieldEnum.SECRET,
    ConfigurationTypeFieldEnum.SECRETMULTILINE,
  ].includes(
    config.find(configField => configField.name === field)?.type as ConfigurationTypeFieldEnum,
  );
}

export const getPluginStatusLabel = (
  channelData: PluginConfigurationBaseFragment,
): MessageDescriptor =>
  channelData.active ? pluginStatusMessages.active : pluginStatusMessages.deactivated;
export const getPluginStatusColor = (channelData: PluginConfigurationBaseFragment): PillColor =>
  channelData.active ? "success" : "error";
