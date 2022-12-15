import { gql } from "@apollo/client";

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
