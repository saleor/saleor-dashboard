import { ConfigurationTypeFieldEnum } from "@saleor/types/globalTypes";
import { PluginConfiguration_pluginConfiguration } from "./types/pluginConfiguration";
import { PluginConfigurations_pluginConfigurations_edges_node } from "./types/pluginConfigurations";

export const pluginList: PluginConfigurations_pluginConfigurations_edges_node[] = [
  {
    __typename: "PluginConfiguration",
    active: true,
    description:
      "Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula. Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis ac, laoreet enim. Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet sit amet magna.",
    id: "Jzx123sEt==",
    name: "Avalara"
  },
  {
    __typename: "PluginConfiguration",
    active: false,
    description:
      "Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula. Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis ac, laoreet enim. Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet sit amet magna.",
    id: "Jzx123sEt==",
    name: "VatLayer"
  }
];
export const plugin: PluginConfiguration_pluginConfiguration = {
  __typename: "PluginConfiguration",
  active: true,
  configuration: [
    {
      __typename: "ConfigurationItem",
      helpText: "Provide user or account details",
      label: "Username or account",
      name: "Username or account",
      type: ConfigurationTypeFieldEnum.STRING,
      value: ""
    },
    {
      __typename: "ConfigurationItem",
      helpText: "Provide password or license details",
      label: "Password or license",
      name: "Password or license",
      type: ConfigurationTypeFieldEnum.STRING,
      value: ""
    },
    {
      __typename: "ConfigurationItem",
      helpText: "Determines if Saleor should use Avatax sandbox API.",
      label: "Use sandbox",
      name: "Use sandbox",
      type: ConfigurationTypeFieldEnum.BOOLEAN,
      value: "true"
    }
  ],
  description:
    "Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula. Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis ac, laoreet enim. Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet sit amet magna.",

  id: "UGx1Z2luQ29uZmlndXJhdGlvbjoy",
  name: "Username or account"
};
