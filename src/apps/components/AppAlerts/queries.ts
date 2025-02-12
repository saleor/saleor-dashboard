import { gql } from "@apollo/client";

export const appFailedPendingWebhooks = gql`
  query AppFailedPendingWebhooks {
    apps(first: 50) {
      edges {
        node {
          webhooks {
            failedDelivers: eventDeliveries(first: 1, filter: { status: FAILED }) {
              edges {
                node {
                  id
                }
              }
            }
            pendingDelivers: eventDeliveries(first: 1, filter: { status: PENDING }) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;
