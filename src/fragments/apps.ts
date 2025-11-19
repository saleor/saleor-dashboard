import { gql } from "@apollo/client";

export const appManifestFragment = gql`
  fragment AppManifest on Manifest {
    identifier
    version
    about
    name
    appUrl
    configurationUrl
    tokenTargetUrl
    dataPrivacy
    dataPrivacyUrl
    homepageUrl
    supportUrl
    extensions {
      targetName
      permissions {
        code
        name
      }
      mountName
      url
      label
    }
    permissions {
      code
      name
    }
    brand {
      logo {
        default(format: WEBP, size: 64)
      }
    }
  }
`;

export const appFragment = gql`
  fragment App on App {
    id
    name
    created
    isActive
    type
    homepageUrl
    appUrl
    manifestUrl
    configurationUrl
    supportUrl
    version
    accessToken
    brand {
      logo {
        default(format: WEBP, size: 64)
      }
    }
    privateMetadata @include(if: $hasManagedAppsPermission) {
      key
      value
    }
    metadata @include(if: $hasManagedAppsPermission) {
      key
      value
    }
    tokens @include(if: $hasManagedAppsPermission) {
      authToken
      id
      name
    }
    webhooks @include(if: $hasManagedAppsPermission) {
      ...Webhook
    }
  }
`;

export const appInstallationFragment = gql`
  fragment AppInstallation on AppInstallation {
    status
    message
    appName
    manifestUrl
    id
    brand {
      logo {
        default(format: WEBP, size: 64)
      }
    }
  }
`;

export const appListItemFragment = gql`
  fragment AppListItem on App {
    id
    name
    isActive
    type
    appUrl
    manifestUrl
    version
    created
    brand {
      logo {
        default(format: WEBP, size: 64)
      }
    }
    permissions {
      ...AppPermission
    }
    ...AppEventDeliveries
  }
`;

export const appPermissionFragment = gql`
  fragment AppPermission on Permission {
    name
    code
  }
`;

export const appAvatarFragment = gql`
  fragment AppAvatar on App {
    id
    name
    brand {
      logo {
        default(format: WEBP, size: 64)
      }
    }
  }
`;

export const webhookAttemptFragment = gql`
  fragment EventDeliveryAttempt on EventDeliveryAttempt {
    id
    createdAt
    status
    response
    responseStatusCode
  }
`;

export const appEventDeliveriesFragment = gql`
  fragment AppEventDeliveries on App {
    webhooks @include(if: $canFetchAppEvents) {
      failedDelivers: eventDeliveries(
        first: 1
        filter: { status: FAILED }
        sortBy: { field: CREATED_AT, direction: DESC }
      ) {
        edges {
          node {
            id
            createdAt
            attempts(first: 1, sortBy: { field: CREATED_AT, direction: DESC }) {
              edges {
                node {
                  id
                  status
                  createdAt
                }
              }
            }
          }
        }
      }
      pendingDelivers: eventDeliveries(
        first: 6
        filter: { status: PENDING }
        sortBy: { field: CREATED_AT, direction: DESC }
      ) {
        edges {
          node {
            id
            attempts(first: 6, sortBy: { field: CREATED_AT, direction: DESC }) {
              edges {
                node {
                  id
                  status
                  createdAt
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const InstalledApp = gql`
  fragment InstalledApp on App {
    id
    identifier
    manifestUrl
    isActive
  }
`;

export const InstalledAppDetails = gql`
  fragment InstalledAppDetails on App {
    id
    isActive
    name
    type
    brand {
      logo {
        default(format: WEBP, size: 64)
      }
    }
  }
`;
