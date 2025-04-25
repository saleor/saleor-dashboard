import { gql } from "@apollo/client";

export const appFailedPendingWebhooks = gql`
  query AppFailedPendingWebhooks($canFetchAppEvents: Boolean!) {
    apps(first: 50, filter: { type: THIRDPARTY }) {
      edges {
        node {
          id
          ...AppEventDeliveries
        }
      }
    }
  }
`;
