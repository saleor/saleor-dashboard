import { gql } from "@apollo/client";

export const webhooksDetails = gql`
  query WebhookDetails($id: ID!) {
    webhook(id: $id) {
      ...WebhookFragment
      syncEvents {
        eventType
      }
      asyncEvents {
        eventType
      }
      secretKey
      targetUrl
    }
  }
`;
