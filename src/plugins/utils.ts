import { PluginConfiguarionFragment_configuration } from "@saleor/fragments/types/PluginConfiguarionFragment";
import { ConfigurationTypeFieldEnum } from "@saleor/types/globalTypes";

export function isSecretField(
  config: PluginConfiguarionFragment_configuration[],
  field: string
) {
  return [
    ConfigurationTypeFieldEnum.PASSWORD,
    ConfigurationTypeFieldEnum.SECRET,
    ConfigurationTypeFieldEnum.SECRETMULTILINE
  ].includes(config.find(configField => configField.name === field).type);
}
