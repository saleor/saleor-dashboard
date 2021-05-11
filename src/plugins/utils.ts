import { PluginConfigurationFragment_configuration } from "@saleor/fragments/types/PluginConfigurationFragment";
import { ConfigurationTypeFieldEnum } from "@saleor/types/globalTypes";

export function isSecretField(
  config: PluginConfigurationFragment_configuration[],
  field: string
) {
  return [
    ConfigurationTypeFieldEnum.PASSWORD,
    ConfigurationTypeFieldEnum.SECRET,
    ConfigurationTypeFieldEnum.SECRETMULTILINE
  ].includes(config.find(configField => configField.name === field).type);
}
