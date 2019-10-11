import gql from "graphql-tag";

import { TypedQuery } from "../queries";
import { Webhook, WebhookVariables } from "./types/Webhook";
import { Webhooks, WebhooksVariables } from "./types/Webhooks";

export const webhooksFragment = gql`
  fragment WebhookFragment on Webhook {
    id
    name
    events {
      eventType
    }
    isActive
    secretKey
    targetUrl
    serviceAccount {
      id
      name
    }
  }
`;

export const webhooksDetailsFragment = gql`
  ${webhooksFragment}
  fragment WebhooksDetailsFragment on Webhook {
    ...WebhookFragment
  }
`;

const webhooksList = gql`
  ${webhooksFragment}
  query Webhooks($first: Int, $after: String, $last: Int, $before: String) {
    webhooks(before: $before, after: $after, first: $first, last: $last) {
      edges {
        node {
          ...WebhookFragment
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;
export const TypedWebhooksListQuery = TypedQuery<Webhooks, WebhooksVariables>(
  webhooksList
);

const webhooksDetails = gql`
  ${webhooksFragment}
  query WebhookDetails($id: ID!) {
    webhook(id: $id) {
      ...WebhookFragment
    }
  }
`;
export const TypedWebhooksDetailsQuery = TypedQuery<Webhook, WebhookVariables>(
  webhooksDetails
);
