import { gql } from "@apollo/client";

export const appFailedPendingWebhooks = gql`
  query AppFailedPendingWebhooks {
    apps(first: 50, filter: { type: THIRDPARTY }) {
      edges {
        node {
          ...AppEventDeliveries
        }
      }
    }
  }
`;
