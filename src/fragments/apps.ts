import { gql } from "@apollo/client";

export const appBaseFragment = gql`
  fragment AppBase on App {
    id
    name
    isActive
    type
    appUrl
    manifestUrl
  }
`;

export const appFragment = gql`
  fragment App on App {
    ...AppBase
    created
    homepageUrl
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
