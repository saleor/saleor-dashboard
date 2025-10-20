import { gql } from "@apollo/client";

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

export const webhookCreate = gql`
  mutation WebhookCreate($input: WebhookCreateInput!) {
    webhookCreate(input: $input) {
      errors {
        ...WebhookError
      }
      webhook {
        ...WebhookDetails
      }
    }
  }
`;

export const webhookUpdate = gql`
  mutation WebhookUpdate($id: ID!, $input: WebhookUpdateInput!) {
    webhookUpdate(id: $id, input: $input) {
      errors {
        ...WebhookError
      }
      webhook {
        ...WebhookDetails
      }
    }
  }
`;

export const webhookDelete = gql`
  mutation WebhookDelete($id: ID!) {
    webhookDelete(id: $id) {
      errors {
        ...WebhookError
      }
    }
  }
`;

export const pluginUpdate = gql`
  mutation PluginUpdate($channelId: ID, $id: ID!, $input: PluginUpdateInput!) {
    pluginUpdate(channelId: $channelId, id: $id, input: $input) {
      errors {
        ...PluginError
      }
      plugin {
        ...PluginsDetails
      }
    }
  }
`;

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
        ...AppError
      }
    }
  }
`;
