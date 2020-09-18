import { webhooksFragment } from "@saleor/fragments/webhooks";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import {
  WebhookDetails,
  WebhookDetailsVariables
} from "./types/WebhookDetails";
import { Webhooks, WebhooksVariables } from "./types/Webhooks";

const webhooksList = gql`
  ${webhooksFragment}
  query Webhooks(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: WebhookFilterInput
    $sort: WebhookSortingInput
  ) {
    webhooks(
      first: $first
      after: $after
      before: $before
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
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
export const useWebhooksListQuery = makeQuery<Webhooks, WebhooksVariables>(
  webhooksList
);

const webhooksDetails = gql`
  ${webhooksFragment}
  query WebhookDetails($id: ID!) {
    webhook(id: $id) {
      ...WebhookFragment
      events {
        eventType
      }
      secretKey
      targetUrl
    }
  }
`;

export const useWebhooksDetailsQuery = makeQuery<
  WebhookDetails,
  WebhookDetailsVariables
>(webhooksDetails);
