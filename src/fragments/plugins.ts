import gql from "graphql-tag";

export const configurationItemFragment = gql`
  fragment ConfigurationItemFragment on ConfigurationItem {
    name
    value
    type
    helpText
    label
  }
`;

export const pluginConfigurationBaseFragment = gql`
  fragment PluginConfigurationBaseFragment on PluginConfiguration {
    active
    channel {
      id
      name
      slug
    }
  }
`;

export const pluginConfigurationExtendedFragment = gql`
  ${configurationItemFragment}
  ${pluginConfigurationBaseFragment}
  fragment PluginConfigurationExtendedFragment on PluginConfiguration {
    ...PluginConfigurationBaseFragment
    configuration {
      ...ConfigurationItemFragment
    }
  }
`;

export const pluginBaseFragment = gql`
  ${pluginConfigurationBaseFragment}
  fragment PluginBaseFragment on Plugin {
    id
    name
    description
    channelConfigurations {
      ...PluginConfigurationBaseFragment
    }
    globalConfiguration {
      ...PluginConfigurationBaseFragment
    }
  }
`;

export const pluginsDetailsFragment = gql`
  ${pluginConfigurationExtendedFragment}
  fragment PluginsDetailsFragment on Plugin {
    id
    name
    description
    globalConfiguration {
      ...PluginConfigurationExtendedFragment
    }
    channelConfigurations {
      ...PluginConfigurationExtendedFragment
    }
  }
`;
