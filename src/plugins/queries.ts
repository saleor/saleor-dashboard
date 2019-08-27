import gql from "graphql-tag";

import { TypedQuery } from "../queries";
import {
  PluginConfiguration,
  PluginConfigurationVariables
} from "./types/pluginConfiguration";
import {
  PluginConfigurations,
  PluginConfigurationsVariables
} from "./types/pluginConfigurations";

export const pluginsFragment = gql`
  fragment pluginFragment on PluginConfiguration {
    id
    name
    description
    active
  }
`;

export const pluginsDetailsFragment = gql`
  ${pluginsFragment}
  fragment pluginsDetailsFragment on PluginConfiguration {
    ...pluginFragment
    configuration {
      name
      type
      value
      helpText
      label
    }
  }
`;

const pluginsList = gql`
  ${pluginsFragment}
  query PluginConfigurations(
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    pluginConfigurations(
      before: $before
      after: $after
      first: $first
      last: $last
    ) {
      edges {
        node {
          ...pluginFragment
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;
export const TypedPluginsListQuery = TypedQuery<
  PluginConfigurations,
  PluginConfigurationsVariables
>(pluginsList);

const pluginsDetails = gql`
  ${pluginsDetailsFragment}
  query PluginConfiguration($id: ID!) {
    pluginConfiguration(id: $id) {
      ...pluginsDetailsFragment
    }
  }
`;
export const TypedPluginsDetailsQuery = TypedQuery<
  PluginConfiguration,
  PluginConfigurationVariables
>(pluginsDetails);
