import { PluginConfiguration_pluginConfiguration } from "./types/pluginConfiguration";
import { PluginConfigurations_pluginConfigurations_edges_node } from "./types/pluginConfigurations";
import { ConfigurationTypeFieldEnum } from "@saleor/types/globalTypes";

export const pluginList: PluginConfigurations_pluginConfigurations_edges_node[] = [
  {
    __typename: "PluginConfiguration",
    id: "Jzx123sEt==",
    name: "Avalara",
    description:
      "Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula. Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis ac, laoreet enim. Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet sit amet magna.",
    active: true
  },
  {
    __typename: "PluginConfiguration",
    id: "Jzx123sEt==",
    name: "VatLayer",
    description:
      "Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula. Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis ac, laoreet enim. Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet sit amet magna.",
    active: false
  }
];
export const plugin: PluginConfiguration_pluginConfiguration = {
  __typename: "PluginConfiguration",
  id: "UGx1Z2luQ29uZmlndXJhdGlvbjoy",
  name: "Username or account",
  description:
    "Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula. Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis ac, laoreet enim. Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet sit amet magna.",
  active: true,
  configuration: [
    {
      __typename: "ConfigurationItem",
      name: "Username or account",
      value: "",
      type: ConfigurationTypeFieldEnum.STRING,
      helpText: "Provide user or account details",
      label: "Username or account"
    },
    {
      __typename: "ConfigurationItem",
      name: "Password or license",
      value: "",
      type: ConfigurationTypeFieldEnum.STRING,
      helpText: "Provide password or license details",
      label: "Password or license"
    },
    {
      __typename: "ConfigurationItem",
      name: "Use sandbox",
      value: "true",
      type: ConfigurationTypeFieldEnum.BOOLEAN,
      helpText: "Determines if Saleor should use Avatax sandbox API.",
      label: "Use sandbox"
    }
  ]
};
