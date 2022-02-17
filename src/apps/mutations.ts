import { gql } from "@apollo/client";

export const appCreateMutation = gql`
  mutation AppCreate($input: AppInput!) {
    appCreate(input: $input) {
      authToken
      app {
        ...App
      }
      errors {
        ...AppError
      }
    }
  }
`;

export const appDeleteMutation = gql`
  mutation AppDelete($id: ID!) {
    appDelete(id: $id) {
      app {
        ...App
      }
      errors {
        ...AppError
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
        ...AppError
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
        ...AppError
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
        ...AppError
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
        ...AppError
      }
    }
  }
`;

export const appUpdateMutation = gql`
  mutation AppUpdate($id: ID!, $input: AppInput!) {
    appUpdate(id: $id, input: $input) {
      app {
        ...App
        permissions {
          code
          name
        }
      }
      errors {
        ...AppError
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
        ...AppError
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
        ...AppError
      }
    }
  }
`;

export const appActivateMutation = gql`
  mutation AppActivate($id: ID!) {
    appActivate(id: $id) {
      errors {
        ...AppError
      }
    }
  }
`;

export const appDeactivateMutation = gql`
  mutation AppDeactivate($id: ID!) {
    appDeactivate(id: $id) {
      errors {
        ...AppError
      }
    }
  }
`;
