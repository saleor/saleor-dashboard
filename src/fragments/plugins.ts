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

export const pluginConfigurationFragment = gql`
  ${configurationItemFragment}
  fragment PluginConfiguarionFragment on PluginConfiguration {
    active
    channel {
      id
      name
      slug
    }
    configuration {
      ...ConfigurationItemFragment
    }
  }
`;

export const pluginsFragment = gql`
  ${pluginConfigurationFragment}
  fragment PluginFragment on Plugin {
    id
    name
    description
    globalConfiguration {
      ...PluginConfiguarionFragment
    }
    channelConfigurations {
      ...PluginConfiguarionFragment
    }
  }
`;

export const pluginsDetailsFragment = gql`
  ${pluginsFragment}
  fragment PluginsDetailsFragment on Plugin {
    ...PluginFragment
  }
`;
