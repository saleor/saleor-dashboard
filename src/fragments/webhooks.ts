import { gql } from "@apollo/client";

export const webhooksFragment = gql`
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

export const webhooksDetailsFragment = gql`
  fragment WebhooksDetails on Webhook {
    ...Webhook
  }
`;
