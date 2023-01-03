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
    permissions {
      code
      name
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
      ...Webhook
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
    permissions {
      ...AppPermission
    }
  }
`;

export const appPermissionFragment = gql`
  fragment AppPermission on Permission {
    name
    code
  }
`;
