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
    # Removed from Webhook in 3.24. @lockSchema keeps it off the wire on staging builds, so the
    # one document serves both schemas — see src/graphql/lockSchema.ts. Readers are gated behind
    # isMainSchema(); delete the line and its readers once staging becomes main.
    secretKey @lockSchema(schema: "main")
    targetUrl
    subscriptionQuery
    customHeaders
  }
`;
