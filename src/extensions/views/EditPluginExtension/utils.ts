import {
  ConfigurationItemFragment,
  ConfigurationTypeFieldEnum,
  PluginConfigurationBaseFragment,
} from "@dashboard/graphql";

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
  ].includes(config.find(configField => configField.name === field).type);
}
