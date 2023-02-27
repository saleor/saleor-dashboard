import { gql } from "@apollo/client";

export const configurationItemFragment = gql`
  fragment ConfigurationItem on ConfigurationItem {
    name
    value
    type
    helpText
    label
  }
`;

export const pluginConfigurationBaseFragment = gql`
  fragment PluginConfigurationBase on PluginConfiguration {
    active
    channel {
      id
      name
      slug
    }
  }
`;

export const pluginConfigurationExtendedFragment = gql`
  fragment PluginConfigurationExtended on PluginConfiguration {
    ...PluginConfigurationBase
    configuration {
      ...ConfigurationItem
    }
  }
`;

export const pluginBaseFragment = gql`
  fragment PluginBase on Plugin {
    id
    name
    description
    channelConfigurations {
      ...PluginConfigurationBase
    }
    globalConfiguration {
      ...PluginConfigurationBase
    }
  }
`;

export const pluginsDetailsFragment = gql`
  fragment PluginsDetails on Plugin {
    id
    name
    description
    globalConfiguration {
      ...PluginConfigurationExtended
    }
    channelConfigurations {
      ...PluginConfigurationExtended
    }
  }
`;
