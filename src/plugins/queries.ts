import { gql } from "@apollo/client";

export const pluginsList = gql`
  query Plugins(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: PluginFilterInput
    $sort: PluginSortingInput
  ) {
    plugins(
      before: $before
      after: $after
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        node {
          ...PluginBase
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

export const pluginsDetails = gql`
  query Plugin($id: ID!) {
    plugin(id: $id) {
      ...PluginsDetails
    }
  }
`;
