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
