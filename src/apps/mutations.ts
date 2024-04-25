import { gql } from "@apollo/client";

export const appCreateMutation = gql`
  mutation AppCreate($input: AppInput!, $hasManagedAppsPermission: Boolean = true) {
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
  mutation AppDelete($id: ID!, $hasManagedAppsPermission: Boolean = true) {
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
        ...AppManifest
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
  mutation AppUpdate($id: ID!, $input: AppInput!, $hasManagedAppsPermission: Boolean = true) {
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

export const appUpdatePermissions = gql`
  mutation AppUpdatePermissions($id: ID!, $permissions: [PermissionEnum!]!) {
    appUpdate(id: $id, input: { permissions: $permissions }) {
      app {
        permissions {
          code
          name
        }
      }
      errors {
        message
      }
    }
  }
`;
