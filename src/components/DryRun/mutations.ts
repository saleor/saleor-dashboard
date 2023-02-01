import { gql } from "@apollo/client";

export const triggerWebhookDryRun = gql`
  mutation TriggerWebhookDryRun($objectId: ID!, $query: String!) {
    webhookDryRun(objectId: $objectId, query: $query) {
      payload
      errors {
        field
        message
      }
    }
  }
`;
