import { gql } from "@apollo/client";

export const appsList = gql`
  query AppsList(
    $before: String
    $after: String
    $first: Int
    $last: Int
    $sort: AppSortingInput
    $filter: AppFilterInput
    $canFetchAppEvents: Boolean!
  ) {
    apps(
      before: $before
      after: $after
      first: $first
      last: $last
      sortBy: $sort
      filter: $filter
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        node {
          ...AppListItem
        }
      }
    }
  }
`;

export const EXTENSION_LIST_QUERY = "ExtensionList";
