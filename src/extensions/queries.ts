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

export const appDetails = gql`
  query App($id: ID!, $hasManagedAppsPermission: Boolean!) {
    app(id: $id) {
      ...App
      aboutApp
      author
      permissions {
        code
        name
      }
      dataPrivacy
      dataPrivacyUrl
      brand {
        logo {
          default(size: 64, format: WEBP)
        }
      }
    }
  }
`;

export const EXTENSION_LIST_QUERY = "ExtensionList";
export const extensionList = gql`
  query ExtensionList($filter: AppExtensionFilterInput!) {
    appExtensions(filter: $filter, first: 100) {
      edges {
        node {
          id
          label
          url
          mountName
          targetName
          settings
          accessToken
          permissions {
            code
          }
          app {
            id
            appUrl
            name
            brand {
              logo {
                default(size: 32, format: WEBP)
              }
            }
          }
        }
      }
    }
  }
`;
export const appWebhookDeliveries = gql`
  query AppWebhookDeliveries($appId: ID!) {
    app(id: $appId) {
      webhooks {
        id
        name
        isActive
        syncEvents {
          name
        }
        asyncEvents {
          name
        }
        eventDeliveries(first: 10, sortBy: { field: CREATED_AT, direction: DESC }) {
          edges {
            node {
              id
              createdAt
              status
              eventType
              attempts(first: 10, sortBy: { field: CREATED_AT, direction: DESC }) {
                edges {
                  node {
                    ...EventDeliveryAttempt
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const webhooksDetails = gql`
  query WebhookDetails($id: ID!) {
    webhook(id: $id) {
      ...WebhookDetails
    }
  }
`;

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
