import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

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
  query AppsList($before: String, $after: String, $first: Int, $last: Int) {
    apps(before: $before, after: $after, first: $first, last: $last) {
      edges {
        node {
          ...AppFragment
        }
      }
    }
  }
`;

export const useInstalledAppsListQuery = makeQuery<AppsList, AppsListVariables>(
  installedAppsList
);
