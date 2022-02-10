import { gql } from "@apollo/client";

export const appCreateMutation = gql`
  mutation AppCreate($input: AppInput!) {
    appCreate(input: $input) {
      authToken
      app {
        ...AppFragment
      }
      errors {
        ...AppErrorFragment
      }
    }
  }
`;

export const appDeleteMutation = gql`
  mutation AppDelete($id: ID!) {
    appDelete(id: $id) {
      app {
        ...AppFragment
      }
      errors {
        ...AppErrorFragment
      }
    }
  }
`;

export const appDeleteFailedInstallationMutation = gql`
  mutation AppDeleteFailedInstallation($id: ID!) {
    appDeleteFailedInstallation(id: $id) {
      appInstallation {
        id
        status
        appName
        message
      }
      errors {
        ...AppErrorFragment
      }
    }
  }
`;

export const appFetchMutation = gql`
  mutation AppFetch($manifestUrl: String!) {
    appFetchManifest(manifestUrl: $manifestUrl) {
      manifest {
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
      errors {
        ...AppErrorFragment
      }
    }
  }
`;

export const appInstallMutation = gql`
  mutation AppInstall($input: AppInstallInput!) {
    appInstall(input: $input) {
      appInstallation {
        id
        status
        appName
        manifestUrl
      }
      errors {
        ...AppErrorFragment
      }
    }
  }
`;

export const appRetryInstallMutation = gql`
  mutation AppRetryInstall($id: ID!) {
    appRetryInstall(id: $id) {
      appInstallation {
        id
        status
        appName
        manifestUrl
      }
      errors {
        ...AppErrorFragment
      }
    }
  }
`;

export const appUpdateMutation = gql`
  mutation AppUpdate($id: ID!, $input: AppInput!) {
    appUpdate(id: $id, input: $input) {
      app {
        ...AppFragment
        permissions {
          code
          name
        }
      }
      errors {
        ...AppErrorFragment
        message
        permissions
      }
    }
  }
`;

export const appTokenCreateMutation = gql`
  mutation AppTokenCreate($input: AppTokenInput!) {
    appTokenCreate(input: $input) {
      appToken {
        name
        authToken
        id
      }
      authToken
      errors {
        ...AppErrorFragment
      }
    }
  }
`;

export const appTokenDeleteMutation = gql`
  mutation AppTokenDelete($id: ID!) {
    appTokenDelete(id: $id) {
      appToken {
        name
        authToken
        id
      }
      errors {
        ...AppErrorFragment
      }
    }
  }
`;

export const appActivateMutation = gql`
  mutation AppActivate($id: ID!) {
    appActivate(id: $id) {
      errors {
        ...AppErrorFragment
      }
    }
  }
`;

export const appDeactivateMutation = gql`
  mutation AppDeactivate($id: ID!) {
    appDeactivate(id: $id) {
      errors {
        ...AppErrorFragment
      }
    }
  }
`;
