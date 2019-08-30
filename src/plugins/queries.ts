import gql from "graphql-tag";

import { TypedQuery } from "../queries";
import { Plugin, PluginVariables } from "./types/Plugin";
import { Plugins, PluginsVariables } from "./types/Plugins";

export const pluginsFragment = gql`
  fragment PluginFragment on Plugin {
    id
    name
    description
    active
  }
`;

export const pluginsDetailsFragment = gql`
  ${pluginsFragment}
  fragment PluginsDetailsFragment on Plugin {
    ...PluginFragment
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
  query Plugins($first: Int, $after: String, $last: Int, $before: String) {
    plugins(before: $before, after: $after, first: $first, last: $last) {
      edges {
        node {
          ...PluginFragment
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
export const TypedPluginsListQuery = TypedQuery<Plugins, PluginsVariables>(
  pluginsList
);

const pluginsDetails = gql`
  ${pluginsDetailsFragment}
  query Plugin($id: ID!) {
    plugin(id: $id) {
      ...PluginsDetailsFragment
    }
  }
`;
export const TypedPluginsDetailsQuery = TypedQuery<Plugin, PluginVariables>(
  pluginsDetails
);
