import { gql } from "@apollo/client";

export const webhookFragment = gql`
  fragment Webhook on Webhook {
    id
    name
    isActive
    app {
      id
      name
    }
  }
`;

export const webhookDetailsFragment = gql`
  fragment WebhookDetails on Webhook {
    ...Webhook
    syncEvents {
      eventType
    }
    asyncEvents {
      eventType
    }
    secretKey
    targetUrl
    subscriptionQuery
    customHeaders
  }
`;
