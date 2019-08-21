import gql from "graphql-tag";

import { TypedQuery } from "../queries";
import { PluginDetails, PluginDetailsVariables } from "./types/PluginDetails";
import { PluginsList, PluginsListVariables } from "./types/PluginsList";

export const pluginsFragment = gql`
  fragment pluginFragment on PluginConfiguration {
    id
    name
    description
    active
  }
`;

// export const pluginsDetailsFragment = gql`
//   ${pluginsFragment}
//   fragment pluginsDetailsFragment on PluginConfiguration {
//     ...pluginFragment
//     configuration {
//       name
//       type
//       value
//       helpText
//       label
//     }
//   }
// `;

const pluginsList = gql`
  ${pluginsFragment}
  query pluginConfigurations(
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
    }
  }
`;
export const TypedPluginsListQuery = TypedQuery<
  PluginsList,
  PluginsListVariables
>(pluginsList);

// const pluginsDetails = gql`
//   ${pluginsDetailsFragment}
//   query pluginConfiguration($id: ID!) {
//     page(id: $id) {
//       ...pluginsDetailsFragment
//     }
//   }
// `;
// export const TypedPluginsDetailsQuery = TypedQuery<
//   PluginDetails,
//   PluginDetailsVariables
// >(pluginsDetails);
