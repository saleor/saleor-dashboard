import { webhooksFragment } from "@saleor/fragments/webhooks";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import {
  WebhookDetails,
  WebhookDetailsVariables
} from "./types/WebhookDetails";

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
