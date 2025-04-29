import { gql } from "@apollo/client";

export const installedApps = gql`
  query InstalledApps(
    $before: String
    $after: String
    $first: Int
    $last: Int
    $filter: AppFilterInput
  ) {
    apps(before: $before, after: $after, first: $first, last: $last, filter: $filter) {
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

export const installedAppsList = gql`
  query InstalledAppsList(
    $before: String
    $after: String
    $first: Int
    $last: Int
    $filter: AppFilterInput
  ) {
    apps(before: $before, after: $after, first: $first, last: $last, filter: $filter) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        node {
          ...InstalledAppDetails
        }
      }
    }
  }
`;

export const eventDeliveries = gql`
  query EventDelivery(
    $before: String
    $after: String
    $first: Int
    $last: Int
    $filter: AppFilterInput
    $canFetchAppEvents: Boolean!
  ) {
    apps(before: $before, after: $after, first: $first, last: $last, filter: $filter) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          ...AppEventDeliveries
        }
      }
    }
  }
`;

export const appsInstallations = gql`
  query AppsInstallations {
    appsInstallations {
      ...AppInstallation
    }
  }
`;
