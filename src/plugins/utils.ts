import { ConfigurationTypeFieldEnum } from "@saleor/types/globalTypes";

import { Plugin_plugin_configuration } from "./types/Plugin";

export function isSecretField(
  config: Plugin_plugin_configuration[],
  field: string
) {
  return [
    ConfigurationTypeFieldEnum.PASSWORD,
    ConfigurationTypeFieldEnum.SECRET,
    ConfigurationTypeFieldEnum.SECRETMULTILINE
  ].includes(config.find(configField => configField.name === field).type);
}
