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
        default(format: WEBP, size: 24)
      }
    }
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

export const appInstallationFragment = gql`
  fragment AppInstallation on AppInstallation {
    status
    message
    appName
    manifestUrl
    id
    brand {
      logo {
        default(format: WEBP, size: 32)
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
    brand {
      logo {
        default(format: WEBP, size: 32)
      }
    }
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

export const appAvatarFragment = gql`
  fragment AppAvatar on App {
    id
    name
    # TODO: Add app image
  }
`;
