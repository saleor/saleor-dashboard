import gql from "graphql-tag";

import { TypedQuery } from "../queries";
import { ServiceList, ServiceListVariables } from "./types/ServiceList";
import { Webhook, WebhookVariables } from "./types/Webhook";
import { Webhooks, WebhooksVariables } from "./types/Webhooks";

export const serviceFragment = gql`
  fragment ServiceFragment on ServiceAccount {
    id
    name
    isActive
  }
`;

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

const serviceList = gql`
  ${serviceFragment}
  query ServiceList($first: Int, $after: String, $last: Int, $before: String) {
    serviceAccounts(
      first: $first
      after: $after
      before: $before
      last: $last
    ) {
      edges {
        node {
          ...ServiceFragment
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
export const TypedServiceListQuery = TypedQuery<
  ServiceList,
  ServiceListVariables
>(serviceList);

const webhooksDetails = gql`
  ${webhooksFragment}
  query Webhook($id: ID!) {
    webhook(id: $id) {
      ...WebhookFragment
    }
  }
`;
export const TypedWebhooksDetailsQuery = TypedQuery<Webhook, WebhookVariables>(
  webhooksDetails
);
