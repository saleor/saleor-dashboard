import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { AppsInstallations } from "./types/AppsInstallations";
import { AppsList, AppsListVariables } from "./types/AppsList";

export const appFragment = gql`
  fragment AppFragment on App {
    id
    name
    created
    isActive
    type
    homepageUrl
    appUrl
    configurationUrl
    supportUrl
    version
    privateMetadata {
      key
      value
    }
    metadata {
      key
      value
    }
    webhooks {
      name
    }
  }
`;

const installedAppsList = gql`
  ${appFragment}
  query AppsList(
    $filter: AppFilterInput
    $sortBy: AppSortingInput
    $before: String
    $after: String
    $first: Int
    $last: Int
  ) {
    apps(
      filter: $filter
      sortBy: $sortBy
      before: $before
      after: $after
      first: $first
      last: $last
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
          ...AppFragment
        }
      }
    }
  }
`;

const appsInProgressList = gql`
  query AppsInstallations {
    appsInstallations {
      status
      message
      appName
      manifestUrl
      id
    }
  }
`;

export const useInstalledAppsListQuery = makeQuery<AppsList, AppsListVariables>(
  installedAppsList
);

export const useAppsInProgressListQuery = makeQuery<AppsInstallations, {}>(
  appsInProgressList
);
