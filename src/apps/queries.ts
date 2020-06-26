import makeQuery from "@saleor/hooks/makeQuery";
import { webhooksFragment } from "@saleor/webhooks/queries";
import gql from "graphql-tag";

import { App, AppVariables } from "./types/App";
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
    accessToken
    privateMetadata {
      key
      value
    }
    metadata {
      key
      value
    }
    tokens {
      authToken
      id
      name
    }
    webhooks {
      ...WebhookFragment
    }
  }
`;

const appsList = gql`
  ${appFragment}
  ${webhooksFragment}
  query AppsList(
    $before: String
    $after: String
    $first: Int
    $last: Int
    $sort: AppSortingInput
    $filter: AppFilterInput
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

const appDetails = gql`
  ${appFragment}
  ${webhooksFragment}
  query App($id: ID!) {
    app(id: $id) {
      ...AppFragment
      aboutApp
      permissions {
        code
        name
      }
      dataPrivacy
      dataPrivacyUrl
    }
  }
`;

export const useAppsListQuery = makeQuery<AppsList, AppsListVariables>(
  appsList
);

export const useAppsInProgressListQuery = makeQuery<AppsInstallations, {}>(
  appsInProgressList
);

export const useAppDetails = makeQuery<App, AppVariables>(appDetails);
