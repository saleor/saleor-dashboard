import { gql } from "@apollo/client";

export const installedApps = gql`
  query InstalledApps($before: String, $after: String, $first: Int, $last: Int) {
    apps(before: $before, after: $after, first: $first, last: $last) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        node {
          ...InstalledApp
        }
      }
    }
  }
`;
