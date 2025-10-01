import { gql } from "@apollo/client";

export const webhooksDetails = gql`
  query WebhookDetails($id: ID!) {
    webhook(id: $id) {
      ...WebhookDetails
    }
  }
`;
