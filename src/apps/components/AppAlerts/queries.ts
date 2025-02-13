import { gql } from "@apollo/client";

export const appFailedPendingWebhooks = gql`
  query AppFailedPendingWebhooks {
    apps(first: 50, filter: { type: THIRDPARTY }) {
      edges {
        node {
          webhooks {
            failedDelivers: eventDeliveries(
              first: 1
              filter: { status: FAILED }
              sortBy: { field: CREATED_AT, direction: DESC }
            ) {
              edges {
                node {
                  id
                }
              }
            }
            pendingDelivers: eventDeliveries(
              first: 1
              filter: { status: PENDING }
              sortBy: { field: CREATED_AT, direction: DESC }
            ) {
              edges {
                node {
                  attempts(first: 6, sortBy: { field: CREATED_AT, direction: DESC }) {
                    edges {
                      node {
                        status
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
